import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // 앱이 시작될 때 저장된 로그인 정보 불러오기
    const loadLoginData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedUsername && savedPassword) {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Failed to load login data", error);
      }
    };
    loadLoginData();
  }, []);

  const handleLogin = async () => {
    if (username && password) {
      try {
        // Remember Me 설정에 따라 로그인 정보 저장/삭제
        if (rememberMe) {
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('password');
        }

        // 사용자 검증 (여기선 예시로 간단히 처리)
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
          onLogin(username); // 사용자 ID 전달
          Alert.alert('Success', 'Logged in successfully!');
        } else {
          Alert.alert('Error', 'Invalid username or password.');
        }
      } catch (error) {
        console.error("Error during login:", error);
        Alert.alert('Error', 'An error occurred during login.');
      }
    } else {
      Alert.alert('Error', 'Please enter valid credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.checkbox}>{rememberMe ? '☑' : '☐'}</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Remember Me</Text>
      </View>
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    fontSize: 18,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
  },
  signupText: {
    color: 'blue',
    marginTop: 16,
    textAlign: 'center',
  },
});
