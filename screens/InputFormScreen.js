import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

export default function InputFormScreen({ onAddEntry, onEditEntry, navigation, route }) {
  const entryToEdit = route.params?.entry;
  const entryIndex = route.params?.index; // Capture the index for editing

  const [formData, setFormData] = useState({
    Date: '',
    Aircraft_Model: '',
    Aircraft_ID: '',
    From: '',
    To: '',
    Single_Engine: '',
    Multi_Engine: '',
    Helicopter: '',
    Dual_Received: '',
    Pilot_In_Command: '',
    Second_In_Command: '',
    Flight_Instructor: '',
    Ground_Trainer: '',
    Day: '',
    Night: '',
    Cross_Country: '',
    Actual_Instrument: '',
    Simulated_Instrument: '',
    Inst_App: '',
    LDG_Day: '',
    LDG_Night: '',
    Flight_Duration: '',
    Remarks: '',
  });

  useEffect(() => {
    if (entryToEdit) {
      setFormData(entryToEdit);
    }
  }, [entryToEdit]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!/^\d{6}$/.test(formData.Date)) {
      Alert.alert("Invalid Date", "Date must be in YYMMDD format.");
      return;
    }

    if (entryIndex !== undefined) {
      onEditEntry(formData, entryIndex); // Edit existing entry
    } else {
      onAddEntry(formData); // Add new entry
    }

    Alert.alert("Entry Saved", "The entry has been saved successfully.");
    navigation.navigate("DataTableScreen");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Flight Logbook Entry</Text>

        {/* Date & Aircraft Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Aircraft Info</Text>
          <TextInputField
            label="Date"
            value={formData.Date}
            onChangeText={(value) => handleInputChange('Date', value)}
            placeholder="YYMMDD"
          />
          <TextInputField label="Aircraft Model" value={formData.Aircraft_Model} onChangeText={(value) => handleInputChange('Aircraft_Model', value)} />
          <TextInputField label="Aircraft ID" value={formData.Aircraft_ID} onChangeText={(value) => handleInputChange('Aircraft_ID', value)} />
        </View>

        {/* Departure & Arrival */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departure & Arrival</Text>
          <TextInputField label="From" value={formData.From} onChangeText={(value) => handleInputChange('From', value)} />
          <TextInputField label="To" value={formData.To} onChangeText={(value) => handleInputChange('To', value)} />
        </View>

        {/* Aircraft Category and Classification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aircraft Category and Classification</Text>
          <TextInputField label="Single Engine" value={formData.Single_Engine} onChangeText={(value) => handleInputChange('Single_Engine', value)} />
          <TextInputField label="Multi Engine" value={formData.Multi_Engine} onChangeText={(value) => handleInputChange('Multi_Engine', value)} />
          <TextInputField label="Helicopter" value={formData.Helicopter} onChangeText={(value) => handleInputChange('Helicopter', value)} />
        </View>

        {/* Type of Piloting Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Piloting Time</Text>
          <TextInputField label="Dual Received" value={formData.Dual_Received} onChangeText={(value) => handleInputChange('Dual_Received', value)} />
          <TextInputField label="Pilot In Command" value={formData.Pilot_In_Command} onChangeText={(value) => handleInputChange('Pilot_In_Command', value)} />
          <TextInputField label="Second In Command" value={formData.Second_In_Command} onChangeText={(value) => handleInputChange('Second_In_Command', value)} />
          <TextInputField label="Flight Instructor" value={formData.Flight_Instructor} onChangeText={(value) => handleInputChange('Flight_Instructor', value)} />
        </View>

        {/* Ground Trainer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ground Trainer</Text>
          <TextInputField label="Ground Trainer" value={formData.Ground_Trainer} onChangeText={(value) => handleInputChange('Ground_Trainer', value)} />
        </View>

        {/* Conditions of Flight */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions of Flight</Text>
          <TextInputField label="Day" value={formData.Day} onChangeText={(value) => handleInputChange('Day', value)} />
          <TextInputField label="Night" value={formData.Night} onChangeText={(value) => handleInputChange('Night', value)} />
          <TextInputField label="Cross Country" value={formData.Cross_Country} onChangeText={(value) => handleInputChange('Cross_Country', value)} />
          <TextInputField label="Actual Instrument" value={formData.Actual_Instrument} onChangeText={(value) => handleInputChange('Actual_Instrument', value)} />
          <TextInputField label="Simulated Instrument" value={formData.Simulated_Instrument} onChangeText={(value) => handleInputChange('Simulated_Instrument', value)} />
        </View>

        {/* No. of INST APP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>No. of INST APP</Text>
          <TextInputField label="Inst App" value={formData.Inst_App} onChangeText={(value) => handleInputChange('Inst_App', value)} />
        </View>

        {/* No. of Landings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>No. of Landings</Text>
          <TextInputField label="LDG Day" value={formData.LDG_Day} onChangeText={(value) => handleInputChange('LDG_Day', value)} />
          <TextInputField label="LDG Night" value={formData.LDG_Night} onChangeText={(value) => handleInputChange('LDG_Night', value)} />
        </View>

        {/* Flight Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Duration</Text>
          <TextInputField label="Flight Duration" value={formData.Flight_Duration} onChangeText={(value) => handleInputChange('Flight_Duration', value)} />
        </View>

        {/* Remarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remark</Text>
          <TextInputField label="Remarks" value={formData.Remarks} onChangeText={(value) => handleInputChange('Remarks', value)} />
        </View>

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const TextInputField = ({ label, value, onChangeText, placeholder }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || `Enter ${label}`}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  section: {
    width: '100%',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#fafafa',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
