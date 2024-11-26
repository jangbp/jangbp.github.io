import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to the Flight Logbook!</Text>
      {/* 로그북 기능을 여기에 추가할 수 있습니다 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
    marginTop: 20,
  },
});
