import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import Stack from './src/Stack';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='light' backgroundColor='#6200ee'/>
      <Stack />
    </NavigationContainer>
  );
}