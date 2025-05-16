import React from 'react';
import { Icon } from '@rneui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeStack } from './home/HomeStack';
import Compose from './compose/Compose';
import { ProfileStack } from './profile/ProfileStack';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={
              route.name === 'Home' ? 'home' :
              route.name === 'Compose' ? 'plus' :
              'account'
            }
            type="material-community"
            size={size}
            color={color}
          />
        ),
        ...tabStyles.screenOptions,
      })}
    >
      <Tab.Screen 
        name="Home"
        component={HomeStack}
        options={tabStyles.homeOptions}
      />
      <Tab.Screen 
        name="Compose"
        component={Compose}
        options={{headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff'}}
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileStack}
        options={tabStyles.profileOptions}
      />
    </Tab.Navigator>
  );
}

const tabStyles = {
  screenOptions: {
    tabBarActiveBackgroundColor: '#f7e3ff',
    tabBarActiveTintColor: '#6200ee',
    tabBarInactiveTintColor: '#757575',
  },
  homeOptions: {
    headerShown: false,
  },
  composeOptions: {
    headerShown: true,
  },
  profileOptions: {
    headerShown: false,
  },
};
