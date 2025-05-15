import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return unsubscribe; 
    }, []);

    return (
    <Stack.Navigator
        screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerShown: true,
        }}
    >
        {!user ? (
        <>
            <Stack.Screen name="Onboarding" component={Onboarding}/>
            <Stack.Screen name="SignIn" component={SignIn}/>
            <Stack.Screen name="SignUp" component={SignUp}/>
        </>
        ) : (
        <>
            <Stack.Screen name="Home"component={BottomTabs}options={{ headerShown: true }}/>
            <Stack.Screen name="Edit"component={EditProfileScreen}options={{ title: 'Edit Profile' }}/>
        </>
        )}
    </Stack.Navigator>
  );
}
