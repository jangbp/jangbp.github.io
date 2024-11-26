import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { loadUserData, saveUserData } from './utils/storage'; // storage.js에서 불러오기
import { ScrollView, StyleSheet } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import InputFormScreen from './screens/InputFormScreen';
import DataTableScreen from './screens/DataTableScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]); // 사용자 계정 저장
  const [isReady, setIsReady] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null); // 현재 로그인한 사용자 ID

  // 폰트 로드 및 초기화
  useEffect(() => {
    async function prepareApp() {
      try {
        // SplashScreen 방지
        await SplashScreen.preventAutoHideAsync();

        // 폰트 로드
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        });
      } catch (error) {
        console.warn(error);
      } finally {
        setIsReady(true); // 준비 완료
      }
    }
    prepareApp();
  }, []);

  // 앱 로드 완료 시 스플래시 숨기기
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // 로그인 후 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (loggedInUserId) {
        const userEntries = await loadUserData(loggedInUserId); // 특정 사용자 데이터 로드
        setEntries(userEntries);
      }
    };

    if (isLoggedIn) loadData();
  }, [isLoggedIn, loggedInUserId]);

  // entries 상태 변경 시 데이터 저장
  useEffect(() => {
    if (isLoggedIn && loggedInUserId) {
      saveUserData(loggedInUserId, entries); // 사용자 데이터 저장
    }
  }, [entries, isLoggedIn, loggedInUserId]);

  // 로딩 상태 처리
  if (!isReady) {
    return null;
  }

  const handleLogin = (userId) => {
    setLoggedInUserId(userId); // 로그인 사용자 ID 설정
    setIsLoggedIn(true);
  };

  const handleSignup = (username, password) => {
    setUsers([...users, { username, password }]); // 새 사용자 추가
  };

  const addEntry = (newEntry) => {
    setEntries([...entries, newEntry]); // 새 항목 추가
  };

  const editEntry = (updatedEntry, index) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = updatedEntry; // 특정 항목 업데이트
    setEntries(updatedEntries);
  };

  return (
    <NavigationContainer>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Stack.Navigator initialRouteName="LoginScreen">
          {!isLoggedIn ? (
            <>
              <Stack.Screen
                name="LoginScreen"
                options={{
                  title: 'Login',
                  headerLeft: null, // 뒤로가기 버튼 제거
                }}
              >
                {(props) => (
                  <LoginScreen
                    {...props}
                    onLogin={handleLogin} // 로그인 핸들러 전달
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="SignupScreen"
                options={{ title: 'Sign Up' }}
              >
                {(props) => (
                  <SignupScreen
                    {...props}
                    onSignupComplete={handleSignup} // 회원가입 완료 핸들러 전달
                  />
                )}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen
                name="HomeScreen"
                options={{
                  title: 'Home',
                  headerLeft: null, // 뒤로가기 버튼 제거
                }}
              >
                {(props) => (
                  <HomeScreen
                    {...props}
                    entries={entries}
                    setEntries={setEntries} // 상태 업데이트 핸들러 전달
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="InputFormScreen"
                options={{ title: 'New Entry' }}
              >
                {(props) => (
                  <InputFormScreen
                    {...props}
                    onAddEntry={addEntry} // 항목 추가 핸들러 전달
                    onEditEntry={editEntry} // 항목 편집 핸들러 전달
                    entries={entries}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="DataTableScreen"
                options={{
                  title: 'Entries',
                  headerLeft: null, // 뒤로가기 버튼 제거
                }}
              >
                {(props) => (
                  <DataTableScreen
                    {...props}
                    entries={entries}
                    setEntries={setEntries} // 상태 업데이트 핸들러 전달
                    onEditEntry={(entry, index) => {
                      props.navigation.navigate('InputFormScreen', { entry, index });
                    }}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </ScrollView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});
