import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 사용자 데이터 저장
 * @param {string} userId - 사용자 ID
 * @param {Array} data - 저장할 데이터 (entries)
 */
export const saveUserData = async (userId, data) => {
  try {
    const key = `user_${userId}_entries`;
    const value = JSON.stringify(data);
    await AsyncStorage.setItem(key, value);
    console.log(`Data saved for user: ${userId}`);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

/**
 * 사용자 데이터 불러오기
 * @param {string} userId - 사용자 ID
 * @returns {Array} - 불러온 데이터 (entries) 또는 빈 배열
 */
export const loadUserData = async (userId) => {
  try {
    const key = `user_${userId}_entries`;
    const data = await AsyncStorage.getItem(key);
    console.log(`Data loaded for user: ${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading user data:", error);
    return [];
  }
};

/**
 * 사용자 데이터 삭제
 * @param {string} userId - 사용자 ID
 */
export const clearUserData = async (userId) => {
  try {
    const key = `user_${userId}_entries`;
    await AsyncStorage.removeItem(key);
    console.log(`Data cleared for user: ${userId}`);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
