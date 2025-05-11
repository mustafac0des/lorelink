import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/private/HomeScreen';
import PostScreen from '../screens/private/PostScreen';
import ProfileScreen from '../screens/private/ProfileScreen';

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
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
        component={ProfileScreen}
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