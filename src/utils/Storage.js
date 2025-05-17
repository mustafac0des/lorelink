import AsyncStorage from '@react-native-async-storage/async-storage';
s
if (newStep >= onboardingSteps.length) {
  await AsyncStorage.setItem('onboardingCompleted', 'true');
  navigation.replace('SignIn');
}
