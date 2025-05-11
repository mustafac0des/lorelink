import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfileScreen from '../screens/private/ProfileScreen';

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
          <UserProfileScreen 
            {...props} 
            route={{ 
              ...props.route,
              params: {
                userId: 'currentUser',
                userName: 'John Doe',
                userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
                isOwnProfile: true
              }
            }}
          />
        )}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
}