import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_STORAGE_KEY = '@LoreLink:';

export const StorageKeys = {
  HAS_SEEN_ONBOARDING: `${APP_STORAGE_KEY}hasSeenOnboarding`,
  USER_PREFERENCES: `${APP_STORAGE_KEY}userPreferences`,
  AUTH_TOKEN: `${APP_STORAGE_KEY}authToken`,
};

export const storage = {
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  },
};