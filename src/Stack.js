import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import Onboarding from './public/Onboarding';
import SignIn from './public/SignIn';
import SignUp from './public/SignUp';
import { BottomTabs } from './private/BottomNavigation';
import EditProfileScreen from './private/profile/Edit';

const Stack = createNativeStackNavigator();

export default function Main() {
  const [user, setUser] = useState(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      checkOnboardingStatus(); // call after auth is known
    });

    return unsubscribe;
  }, []);

  const checkOnboardingStatus = async () => {
    const completed = await AsyncStorage.getItem('onboardingCompleted');
    setOnboardingCompleted(completed === 'true');
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#6200ee' } }}>
      {!user ? (
        <>
          {!onboardingCompleted && <Stack.Screen name="Onboarding" component={Onboarding} />}
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      ) : (
        <>
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="Edit" component={EditProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

