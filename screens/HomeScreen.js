import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function HomeScreen({ entries, navigation, setEntries }) {
  const [totals, setTotals] = useState({
    Single_Engine: 0,
    Multi_Engine: 0,
    Helicopter: 0,
    Dual_Received: 0,
    Pilot_In_Command: 0,
    Second_In_Command: 0,
    Flight_Instructor: 0,
    Ground_Trainer: 0,
    Day: 0,
    Night: 0,
    Cross_Country: 0,
    Actual_Instrument: 0,
    Simulated_Instrument: 0,
    Inst_App: 0,
    LDG_Day: 0,
    LDG_Night: 0,
    Flight_Duration: 0,
  });

  const [currencyStatus, setCurrencyStatus] = useState({
    flightProficiency: { met: false, deficit: 0 },
    ifrCurrency: { met: false, deficit: 0 },
    cfiCurrency: { met: false, deficit: 0 },
    nightCurrency: { met: false, deficit: 0 },
  });

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    calculateTotals();
  }, [entries]);

  useEffect(() => {
    checkCurrencyStatus();
  }, [totals]);

  const calculateTotals = () => {
    const newTotals = { ...totals };
    entries.forEach(entry => {
      Object.keys(newTotals).forEach(key => {
        newTotals[key] += parseFloat(entry[key]) || 0;
      });
    });
    setTotals(newTotals);
  };

  const checkCurrencyStatus = () => {
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);
  
    const recentEntries = entries.filter(entry => {
      if (!entry.Date || entry.Date.length !== 6) return false;
  
      const entryDate = new Date(
        `20${entry.Date.slice(0, 2)}-${entry.Date.slice(2, 4)}-${entry.Date.slice(4, 6)}`
      );
      return entryDate >= ninetyDaysAgo;
    });
  
    const recentDayLandings = recentEntries.reduce(
      (acc, entry) => acc + (parseInt(entry.LDG_Day, 10) || 0),
      0
    );
    const recentNightLandings = recentEntries.reduce(
      (acc, entry) => acc + (parseInt(entry.LDG_Night, 10) || 0),
      0
    );
  
    const lastLandingDate = recentEntries
      .filter(entry => parseInt(entry.LDG_Day, 10) > 0 || parseInt(entry.LDG_Night, 10) > 0)
      .map(entry => new Date(`20${entry.Date.slice(0, 2)}-${entry.Date.slice(2, 4)}-${entry.Date.slice(4, 6)}`))
      .sort((a, b) => b - a)[0];
  
    const flightProficiencyDeficit = Math.max(3 - recentDayLandings, 0);
    const nightCurrencyDeficit = Math.max(3 - recentNightLandings, 0);
    const ifrCurrencyDeficit = Math.max(6 - (totals.Actual_Instrument + totals.Simulated_Instrument), 0);
    const cfiCurrencyDeficit = Math.max(10 - totals.Flight_Instructor, 0);
  
    setCurrencyStatus({
      flightProficiency: {
        met: flightProficiencyDeficit === 0,
        deficit: flightProficiencyDeficit,
        lastLandingDate: lastLandingDate ? lastLandingDate.toDateString() : "N/A",
      },
      ifrCurrency: {
        met: ifrCurrencyDeficit === 0,
        deficit: ifrCurrencyDeficit,
        timeRequired: Math.max(6 - totals.Actual_Instrument, 0),
      },
      cfiCurrency: {
        met: cfiCurrencyDeficit === 0,
        deficit: cfiCurrencyDeficit,
      },
      nightCurrency: {
        met: nightCurrencyDeficit === 0,
        deficit: nightCurrencyDeficit,
        lastNightLandingDate: lastLandingDate ? lastLandingDate.toDateString() : "N/A",
      },
    });
  };
  

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleNavigation = (screen) => {
    setModalVisible(false);
    if (screen === 'DataTableScreen') {
      navigation.navigate('DataTableScreen');
    } else if (screen === 'InputFormScreen') {
      navigation.navigate('InputFormScreen');
    }
  };

  const renderCurrencyStatus = (status, label) => {
    return (
      <View style={styles.currencyRow}>
        <Icon
          name={status.met ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={status.met ? 'green' : 'red'}
          style={styles.currencyIcon}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.currencyText}>
            {label}: {status.met ? "Met" : `Not Met`}
          </Text>
          {!status.met && status.deficit !== undefined && (
            <Text style={styles.currencyDetail}>
              {`Deficit: ${status.deficit} more`}
            </Text>
          )}
          {status.lastLandingDate && (
            <Text style={styles.currencyDetail}>
              {`Last Landing: ${status.lastLandingDate}`}
            </Text>
          )}
          {status.timeRequired && (
            <Text style={styles.currencyDetail}>
              {`Additional Time Required: ${status.timeRequired} hours`}
            </Text>
          )}
        </View>
      </View>
    );
  };  

  const handleExportCSV = async () => {
    try {
      setModalVisible(false); // 메뉴창 닫기
      const headers = [
        "Date",
        "Aircraft Make & Model",
        "Aircraft Identification Number",
        "From",
        "To",
        "Single-Engine Land",
        "Multi-Engine Land",
        "Helicopter",
        "Dual Received",
        "Pilot in Command",
        "Second-in-command",
        "Flight Instructor",
        "Ground Trainer",
        "Day",
        "Night",
        "Cross-Country",
        "Actual Instrument",
        "Simulated Instrument",
        "INST APP",
        "LDG Day",
        "LDG Night",
        "Flight Duration",
        "Remarks",
      ];
  
      const csvContent = [
        headers.join(","),
        ...entries.map((entry) => {
          const formattedDate =
            entry.Date && entry.Date.length === 6
              ? `20${entry.Date.slice(0, 2)}-${entry.Date.slice(2, 4)}-${entry.Date.slice(4, 6)}`
              : "0000-00-00";
  
          return [
            formattedDate,
            entry.Aircraft_Model,
            entry.Aircraft_ID,
            entry.From,
            entry.To,
            entry.Single_Engine,
            entry.Multi_Engine,
            entry.Helicopter,
            entry.Dual_Received,
            entry.Pilot_In_Command,
            entry.Second_In_Command,
            entry.Flight_Instructor,
            entry.Ground_Trainer,
            entry.Day,
            entry.Night,
            entry.Cross_Country,
            entry.Actual_Instrument,
            entry.Simulated_Instrument,
            entry.Inst_App,
            entry.LDG_Day,
            entry.LDG_Night,
            entry.Flight_Duration,
            entry.Remarks,
          ].join(",");
        }),
      ].join("\n");
  
      if (typeof window !== "undefined") {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "flight_logbook.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert("Success", "CSV exported successfully!");
      } else {
        const fileUri = FileSystem.documentDirectory + "flight_logbook.csv";
        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred while exporting the CSV file:\n${error.message}`);
    }
  };
  
  const handleImportCSV = async () => {
    try {
      setModalVisible(false); // 메뉴창 닫기
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
          Alert.alert("Error", "No file was selected.");
          return;
        }
  
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          processCSV(fileContent);
        };
        reader.readAsText(file);
      };
      input.click();
    } catch (error) {
      Alert.alert("Error", `An error occurred while importing the CSV file:\n${error.message}`);
    }
  };
  
  const processCSV = (fileContent) => {
    const lines = fileContent.trim().split("\n");
    if (lines.length < 2) {
      Alert.alert("Error", "The CSV file is empty or has invalid content.");
      return;
    }
  
    // 원본 헤더 읽기
    const rawHeaders = lines[0].split(",");
    const headers = rawHeaders.map((header) => header.replace(/"/g, "").trim()); // 큰따옴표 제거 및 트림
  
    // 헤더 매핑 정의
    const headerMapping = {
      "Date": "Date",
      "Aircraft Make & Model": "Aircraft_Model",
      "Aircraft Identification Number": "Aircraft_ID",
      "From": "From",
      "To": "To",
      "Single-Engine Land": "Single_Engine",
      "Multi-Engine Land": "Multi_Engine",
      "Helicopter": "Helicopter",
      "Dual Received": "Dual_Received",
      "Pilot in Command": "Pilot_In_Command",
      "Second-in-command": "Second_In_Command",
      "Flight Instructor": "Flight_Instructor",
      "Ground Trainer": "Ground_Trainer",
      "Day": "Day",
      "Night": "Night",
      "Cross-Country": "Cross_Country",
      "Actual Instrument": "Actual_Instrument",
      "Simulated Instrument": "Simulated_Instrument",
      "INST APP": "Inst_App",
      "LDG Day": "LDG_Day",
      "LDG Night": "LDG_Night",
      "Flight Duration": "Flight_Duration",
      "Remarks": "Remarks",
    };
  
    const importedEntries = lines.slice(1).map((line) => {
      const values = line.split(",");
      const entry = {};
  
      headers.forEach((header, index) => {
        const mappedKey = headerMapping[header];
        if (mappedKey) {
          entry[mappedKey] = values[index]?.replace(/"/g, "").trim() || ""; // 값에서 큰따옴표 제거
        }
      });
  
      // 날짜 처리
      if (entry.Date) {
        const date = entry.Date.replace(/"/g, "").trim(); // 큰따옴표 제거 및 트림
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          // 날짜가 "YYYY-MM-DD" 형식인 경우 "YYMMDD"로 변환
          const [year, month, day] = date.split("-");
          entry.Date = `${year.slice(2)}${month}${day}`;
        } else if (!/^\d{6}$/.test(entry.Date)) {
          // 유효하지 않은 날짜인 경우 기본값 설정
          console.warn(`Invalid Date in imported entry:`, entry);
          entry.Date = "000000";
        }
      } else {
        entry.Date = "000000"; // 기본값 설정
      }
  
      return entry;
    });
  
    setEntries(importedEntries);
    Alert.alert("Success", "CSV data has been imported successfully.");
  };  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Flight Logbook Summary</Text>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="menu-outline" size={30} color="#6E6E6E" />
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalOption} onPress={() => handleNavigation('DataTableScreen')}>Data Table</Text>
          <Text style={styles.modalOption} onPress={() => handleNavigation('InputFormScreen')}>Input Form</Text>
          <Text style={styles.modalOption} onPress={handleImportCSV}>Import CSV</Text>
          <Text style={styles.modalOption} onPress={handleExportCSV}>Export CSV</Text>
          <Text style={styles.modalOption} onPress={toggleModal}>Cancel</Text>
        </View>
      </Modal>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Aircraft Category and Classification</Text>
        <Text>Single Engine: {totals.Single_Engine}</Text>
        <Text>Multi Engine: {totals.Multi_Engine}</Text>
        <Text>Helicopter: {totals.Helicopter}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Type of Piloting Time</Text>
        <Text>Dual Received: {totals.Dual_Received}</Text>
        <Text>Pilot In Command: {totals.Pilot_In_Command}</Text>
        <Text>Second In Command: {totals.Second_In_Command}</Text>
        <Text>Flight Instructor: {totals.Flight_Instructor}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Ground Trainer</Text>
        <Text>Ground Trainer: {totals.Ground_Trainer}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Conditions of Flight</Text>
        <Text>Day: {totals.Day}</Text>
        <Text>Night: {totals.Night}</Text>
        <Text>Cross Country: {totals.Cross_Country}</Text>
        <Text>Actual Instrument: {totals.Actual_Instrument}</Text>
        <Text>Simulated Instrument: {totals.Simulated_Instrument}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>No. of INST APP</Text>
        <Text>INST APP: {totals.Inst_App}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>No. of Landings</Text>
        <Text>LDG Day: {totals.LDG_Day}</Text>
        <Text>LDG Night: {totals.LDG_Night}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Flight Duration</Text>
        <Text>Flight Duration: {totals.Flight_Duration}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Pilot Currency Status</Text>
        {renderCurrencyStatus(currencyStatus.flightProficiency, "Flight Proficiency")}
        {renderCurrencyStatus(currencyStatus.ifrCurrency, "IFR Currency")}
        {renderCurrencyStatus(currencyStatus.cfiCurrency, "CFI Currency")}
        {renderCurrencyStatus(currencyStatus.nightCurrency, "Night Flight Currency")}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
  },
  group: {
    width: '100%',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 5,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currencyIcon: {
    marginRight: 8,
  },
  currencyText: {
    fontSize: 16,
  },
  currencyDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
