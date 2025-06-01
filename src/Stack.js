import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.config';

import Onboarding from './public/Onboarding';
import SignIn from './public/SignIn';
import SignUp from './public/SignUp';

import Home from './private/home/Home';
import Post from './private/home/Post';
import Compose from './private/compose/Compose';
import Profile from './private/profile/Profile';
import Edit from './private/profile/Edit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#6200ee' }, headerTintColor: '#fff' }}
    >
      <HomeStack.Screen name="Home" component={Home}/>
      <HomeStack.Screen name="Post" component={Post}/>
      <HomeStack.Screen name="Profile" component={Profile}/>
    </HomeStack.Navigator>
  );
}

function ProfileStackNavigator({ route }) {
  return (
    <ProfileStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#6200ee' }, headerTintColor: '#fff' }}
    >
      <ProfileStack.Screen
        name="MyProfile"
        component={Profile}
        initialParams={route.params}
        options={{ title: 'My Profile' }}
      />
      <ProfileStack.Screen name="Edit" component={Edit} options={{ title: 'Edit Profile' }} />
    </ProfileStack.Navigator>
  );
}

function TabNavigator() {
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
        tabBarActiveBackgroundColor: '#f7e3ff',
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#757575',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Compose"
        component={Compose}
        options={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ headerShown: false }}
        initialParams={{ userId: auth.currentUser?.uid, isOwnProfile: true }}
      />
    </Tab.Navigator>
  );
}

export default function Main() {
  const [user, setUser] = useState(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
      checkOnboardingStatus();
    });
    return unsubscribe;
  }, []);

  const checkOnboardingStatus = async () => {
    const completed = await AsyncStorage.getItem('onboardingCompleted');
    setOnboardingCompleted(completed === 'true');
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const isVerified = user && user.emailVerified;

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#6200ee' }, headerTintColor: '#fff' }}>
      {!user || !isVerified ? (
        <>
          {!onboardingCompleted && <Stack.Screen name="Onboarding" component={Onboarding} />}
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
