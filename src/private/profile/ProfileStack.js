import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './Profile';
import Edit from './Edit';
import { auth } from '../../../firebaseConfig';

const Stack = createNativeStackNavigator();

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        options={{ title: 'Profile' }}
      >
        {(props) => (
          <Profile
            {...props} 
            route={{ 
              ...props.route,
              params: {
                userId: auth.currentUser?.uid || 'currentUser',
                isOwnProfile: true
              }
            }}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen 
        name="UserProfile" 
        component={Profile}
        options={{ title: 'Profile' }}
      />
      
      <Stack.Screen 
        name="Edit" 
        component={Edit}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}