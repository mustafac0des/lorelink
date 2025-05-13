import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Onboarding from './public/Onboarding';
import SignIn from './public/SignIn';
import SignUp from './public/SignUp';
import Home from './private/home/Home';
import { BottomTabs } from './private/BottomNavigation';
import EditProfileScreen from './private/profile/Edit';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

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
            <Stack.Screen 
            name="Onboarding" 
            component={Onboarding}
            options={{ headerShown: false }}
            />
            <Stack.Screen 
            name="SignIn" 
            component={SignIn}
            options={{ title: 'Sign In' }}
            />
            <Stack.Screen 
            name="SignUp" 
            component={SignUp}
            options={{ title: 'Sign Up' }}
            />
        </>
        ) : (
        <>
            <Stack.Screen 
            name="Home"
            component={BottomTabs}
            options={{ headerShown: true }}
            />
            <Stack.Screen 
            name="Edit"
            component={EditProfileScreen}
            options={{ title: 'Edit Profile' }}
            />
        </>
        )}
    </Stack.Navigator>
  );
}
