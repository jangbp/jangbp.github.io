import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { saveUserData } from '../utils/storage';

export default function DataTableScreen({ entries, navigation, setEntries, loggedInUserId }) {
  const [contextMenuVisible, setContextMenuVisible] = useState(false); // 컨텍스트 메뉴 표시 상태
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }); // 메뉴 위치
  const [selectedEntry, setSelectedEntry] = useState(null); // 선택된 항목

  // entries가 변경될 때마다 데이터 저장
  useEffect(() => {
    if (loggedInUserId) {
      saveUserData(loggedInUserId, entries); // 변경된 데이터를 저장
    }
  }, [entries, loggedInUserId]);

  const handleContextMenu = (event, entry, index) => {
    event.preventDefault(); // 브라우저 기본 우클릭 메뉴 비활성화
    setSelectedEntry({ entry, index });
    setMenuPosition({ x: event.clientX, y: event.clientY }); // 메뉴 위치 설정
    setContextMenuVisible(true); // 메뉴 표시
  };

  const handleOptionSelect = (action) => {
    if (action === 'edit') {
      navigation.navigate("InputFormScreen", { entry: selectedEntry.entry, index: selectedEntry.index });
    } else if (action === 'delete') {
      setEntries(entries.filter((_, i) => i !== selectedEntry.index));
    }
    setContextMenuVisible(false); // 메뉴 닫기
  };

  const formatDate = (date) => {
    if (date && date.length === 6) {
      const year = `20${date.slice(0, 2)}`;
      const month = date.slice(2, 4);
      const day = date.slice(4, 6);
      return `${year}-${month}-${day}`;
    }
    return date || '';
  };

  const formatTime = (value) => (value ? parseFloat(value).toFixed(1) : '');
  const formatCount = (value) => (value ? parseInt(value, 10) : '');

  return (
    <View style={{ flex: 1 }}>
      {/* Home 버튼 추가 */}
      <View style={styles.header}>
        <Text style={styles.title}>Data Table</Text>
        <Icon name="home" size={30} color="#6E6E6E" onPress={() => navigation.navigate("HomeScreen")} />
      </View>

      <ScrollView horizontal>
        <ScrollView contentContainerStyle={styles.container}>
          <DataTable>
            <DataTable.Header style={styles.header}>
              <DataTable.Title style={styles.headerCell}>Date</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Aircraft Model</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Aircraft ID</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>From</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>To</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Single Engine</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Multi Engine</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Helicopter</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Dual Received</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Pilot In Command</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Second In Command</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Flight Instructor</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Ground Trainer</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Day</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Night</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Cross Country</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Actual Instrument</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Simulated Instrument</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Inst App</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>LDG Day</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>LDG Night</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Flight Duration</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Remarks</DataTable.Title>
            </DataTable.Header>

            {entries.map((item, index) => (
              <div
                key={index}
                onContextMenu={(event) => handleContextMenu(event, item, index)}
                style={styles.row}
              >
                <DataTable.Row>
                  <DataTable.Cell style={styles.cell}>{formatDate(item.Date)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{item.Aircraft_Model}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{item.Aircraft_ID}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{item.From}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{item.To}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatCount(item.Single_Engine)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatCount(item.Multi_Engine)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatCount(item.Helicopter)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Dual_Received)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Pilot_In_Command)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Second_In_Command)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Flight_Instructor)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatCount(item.Ground_Trainer)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Day)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Night)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Cross_Country)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Actual_Instrument)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Simulated_Instrument)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatCount(item.Inst_App)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatCount(item.LDG_Day)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatCount(item.LDG_Night)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{formatTime(item.Flight_Duration)}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{item.Remarks}</DataTable.Cell>
                </DataTable.Row>
              </div>
            ))}
          </DataTable>
        </ScrollView>
      </ScrollView>

      {/* 컨텍스트 메뉴 */}
      {contextMenuVisible && (
        <div
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <Text style={styles.menuItem} onClick={() => handleOptionSelect('edit')}>Edit</Text>
          <Text style={styles.menuItem} onClick={() => handleOptionSelect('delete')}>Delete</Text>
          <Text style={styles.menuItem} onClick={() => setContextMenuVisible(false)}>Cancel</Text>
        </div>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    minWidth: 150,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    cursor: 'context-menu',
  },
  cell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    minWidth: 150,
  },
  menuItem: {
    padding: 8,
    cursor: 'pointer',
  },
});
