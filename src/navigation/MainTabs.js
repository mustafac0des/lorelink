import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { HomeStack } from './HomeStack';
import ChatScreen from '../screens/private/StoryScreen';
import { ProfileStackScreen } from './ProfileStack';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={
              route.name === 'Home' ? 'home' :
              route.name === 'Write' ? 'plus' :
              'account'
            }
            type="material-community"
            size={size}
            color={color}
          />
        ),
        tabBarActiveBackgroundColor: '#f7e3ff',
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#757575',
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen 
        name="HomeTab"
        component={HomeStack}
        options={{ headerShown: true, headerTitle: 'Lorelink', headerTitleAlign: 'center' }}
      />
      <Tab.Screen 
        name="Write"
        component={ChatScreen}
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileStackScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}