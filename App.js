import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { enableScreens } from 'react-native-screens';

enableScreens();

import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import SignInScreen from './src/screens/authentication/SignInScreen';
import SignUpScreen from './src/screens/authentication/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import MyStoriesScreen from './src/screens/profile/MyStoriesScreen';
import SettingsScreen from './src/screens/profile/SettingsScreen';
import PostScreen from './src/screens/PostScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen({ setIsLoggedIn }) {
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
            setIsLoggedIn={setIsLoggedIn}
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
      <ProfileStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }} 
      />
      <ProfileStack.Screen 
        name="MyStories" 
        component={MyStoriesScreen} 
        options={{ title: 'My Stories' }} 
      />
      <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
    </ProfileStack.Navigator>
  );
}

function MainTabs({ setIsLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={
              route.name === 'HomeStack' ? 'home' :
              route.name === 'Chat' ? 'chat' :
              'account'
            }
            type="material-community"
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#757575',
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        options={{
          title: 'LoreLink',
          headerShown: true
        }}
      >
        {(props) => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
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
              name="UserProfile" 
              component={UserProfileScreen}
              options={{ 
                headerShown: true,
                title: 'Profile',
                headerStyle: { backgroundColor: '#6200ee' },
                headerTintColor: '#fff',
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          headerShown: true
        }}
      />
      <Tab.Screen 
        name="Profile"
        options={{
          headerShown: false
        }}
      >
        {(props) => <ProfileStackScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
    <StatusBar style='light' backgroundColor='#6200ee'/>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          headerShown: true,
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SignIn"
              options={{
                title: 'Sign In',
                headerShown: true
              }}
            >
              {(props) => <SignInScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen}
              options={{
                title: 'Sign Up',
                headerShown: true
              }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="MainTabs"
            options={{ headerShown: false }}
          >
            {(props) => <MainTabs {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}