import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, Icon } from '@rneui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { signOut, getAuth } from 'firebase/auth';

import { PostsTab, CommentsTab, LikesTab } from '../../components/profile/ProfileTabs';


const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ route, navigation }) {
  const { userId, userName, userImage, isOwnProfile = false } = route.params;
  const [isFollowed, setIsFollowed] = useState(route.params.isFollowed || false);

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
  };

  const renderActionButtons = () => {
    if (isOwnProfile) {
      return (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
          <Button
            title="Edit profile"
            type="outline"
            onPress={() => navigation.navigate('EditProfile')}
            containerStyle={{ flex: 1 }}
            buttonStyle={{
              borderColor: '#6200ee',
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 10
            }}
            titleStyle={{ color: '#6200ee' }}
          />
          <Button
            title="Settings"
            type="outline"
            onPress={() => navigation.navigate('Settings')}
            containerStyle={{ flex: 1 }}
            buttonStyle={{
              borderColor: '#6200ee',
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 10
            }}
            titleStyle={{ color: '#6200ee' }}
          />
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
        <Button
          title={isFollowed ? "Following" : "Follow"}
          type="solid"
          onPress={handleFollow}
          containerStyle={{ flex: 1 }}
          buttonStyle={{
            backgroundColor: isFollowed ? '#fff' : '#6200ee',
            borderColor: '#6200ee',
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 10
          }}
          titleStyle={{ color: isFollowed ? '#6200ee' : '#fff' }}
        />
        <Button
          title="Mention"
          type="outline"
          containerStyle={{ flex: 1 }}
          buttonStyle={{
            borderColor: '#6200ee',
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 10
          }}
          titleStyle={{ color: '#6200ee' }}
        />
      </View>
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const renderHeaderRight = () => {
    if (isOwnProfile) {
      return (
        <Button
          type="clear"
          icon={{
            name: 'logout',
            type: 'material-community',
            size: 24,
            color: '#fff'
          }}
          onPress={handleLogout}
        />
      );
    }
    return null;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight
    });
  }, [navigation, isOwnProfile]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text h4 style={{ marginBottom: 0 }}>{userName}</Text>
              <Icon
                name="checkbox-marked-circle"
                type="material-community"
                size={16}
                color="#0095F6"
              />
            </View>
            <Text style={{ color: '#666', marginBottom: 10 }}>@{userName.toLowerCase().replace(/\s/g, '_')}</Text>
            
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: '#666' }}>Writer | Story Enthusiast</Text>
            </View>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={{ color: '#666' }}>256 followers</Text>
              <Text style={{ color: '#666' }}>·</Text>
              <Text style={{ color: '#666' }}>123 interactions</Text>
            </TouchableOpacity>
          </View>

          <Avatar
            size={80}
            rounded
            source={{ uri: userImage }}
            containerStyle={{ marginLeft: 15 }}
          />
        </View>

        {renderActionButtons()}
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
          tabBarIndicatorStyle: { backgroundColor: '#6200ee' },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: { elevation: 0, shadowOpacity: 0 }
        }}
      >
        <Tab.Screen 
          name="Posts" 
          component={PostsTab}
          options={{ tabBarLabel: 'Posts' }}
        />
        <Tab.Screen 
          name="Comments" 
          component={CommentsTab}
          options={{ tabBarLabel: 'Comments' }}
        />
        <Tab.Screen 
          name="Likes" 
          component={LikesTab}
          options={{ tabBarLabel: 'Likes' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const auth = getAuth();