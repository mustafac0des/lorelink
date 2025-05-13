import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './Profile';
import Edit from './Edit';
import { auth } from '../../../firebaseConfig';

export const ProfileStack = createNativeStackNavigator();

export function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
      }}
    >
      <ProfileStack.Screen 
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
      </ProfileStack.Screen>
      
      <ProfileStack.Screen 
        name="Profile" 
        component={Profile}
        options={({ route }) => ({ 
          title: route.params?.userName || 'User Profile'
        })}
      />
      
      <ProfileStack.Screen 
        name="Edit" 
        component={Edit}
        options={{ title: 'Edit Profile' }}
      />
    </ProfileStack.Navigator>
  );
}