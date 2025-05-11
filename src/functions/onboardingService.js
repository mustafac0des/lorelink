import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@onboarding_completed';

export const getOnboardingStatus = async () => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value !== null;
  } catch (e) {
    return false;
  }
};

export const setOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (e) {
    console.error('Error saving onboarding status:', e);
  }
};