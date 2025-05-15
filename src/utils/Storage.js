import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

export const StorageKeys = {
  HAS_SEEN_ONBOARDING: 'HAS_SEEN_ONBOARDING',
};

export const Storage = {
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(StorageKeys);
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  },

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  },
};