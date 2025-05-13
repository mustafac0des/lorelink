import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home'
import PostScreen from './PostScreen';
import Profile from '../profile/Profile';

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen 
        name="Post" 
        component={PostScreen}
        options={{ 
          headerShown: true,
          title: 'Post',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen 
        name="Profile" 
        component={Profile}
        options={{ 
          headerShown: true,
          title: 'Profile',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}