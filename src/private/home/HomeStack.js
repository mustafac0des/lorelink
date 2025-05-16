import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home'
import PostScreen from './PostScreen';
import Profile from '../profile/Profile';

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff'}}
        >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Post" component={PostScreen} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}