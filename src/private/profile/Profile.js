import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getAuth } from 'firebase/auth';
import { PostsTab, CommentsTab } from './ProfileTabs';
import { handleSignOut, fetchProfileData } from '../../backend/Services';
import { useFocusEffect } from '@react-navigation/native';

import male_default from '../../../assets/male_default.jpg';
import female_default from '../../../assets/female_default.jpg';

const Tab = createMaterialTopTabNavigator();
const auth = getAuth();

export default function ProfileScreen({ route, navigation }) {
  const { dummyId, userId, isOwnProfile = false } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    const userData = await fetchProfileData(dummyId, userId, isOwnProfile);
    setProfileData(userData);
    setLoading(false);
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
          onPress={() => handleSignOut(navigation)}
        />
      );
    }
    return null;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerRight: renderHeaderRight });
  }, [navigation, isOwnProfile]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 10 }}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '80%' }}>
            <Text h4>{profileData.name}</Text>
            <Text style={{ color: '#666' }}>@{profileData.username}</Text>
            <View style={{ marginVertical: 10 }}>
              <Text style={{ color: '#666' }}>{profileData.biography}</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', columnGap: 5 }}>
              <Text style={{ color: '#666' }}>0 followers</Text>
              <Text style={{ color: '#666' }}>·</Text>
              <Text style={{ color: '#666' }}>0 followings</Text>
            </TouchableOpacity>
          </View>
          <Avatar
            size={80}
            rounded
            source={
              profileData.picture !== 'null'
                ? { uri: profileData.picture }
                : profileData.gender === 'male'
                ? male_default
                : female_default
            }
            containerStyle={{
              marginLeft: 0,
              borderColor: '#6200ee',
              borderWidth: 2
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', columnGap: 10, marginTop: 15 }}>
          {isOwnProfile ? (
            <Button
              title="Edit profile"
              type="outline"
              onPress={() => navigation.navigate('Edit')}
              containerStyle={{ flex: 1 }}
              buttonStyle={{
                borderColor: '#6200ee',
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 10
              }}
              titleStyle={{ color: '#6200ee' }}
            />
          ) : (
            <Button
              title={profileData.isFollowed ? 'Following' : 'Follow'}
              type="outline"
              onPress={() =>
                setProfileData({ ...profileData, isFollowed: !profileData.isFollowed })
              }
              containerStyle={{ flex: 1 }}
              buttonStyle={{
                borderColor: '#6200ee',
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 10
              }}
              titleStyle={{ color: '#6200ee' }}
            />
          )}
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
          tabBarIndicatorStyle: { backgroundColor: '#6200ee' }
        }}
      >
        <Tab.Screen
          name="Posts"
          options={{ tabBarLabel: 'Posts' }}
        >
          {() => <PostsTab userId={isOwnProfile ? auth.currentUser?.uid : dummyId} />}
        </Tab.Screen>
        <Tab.Screen
          name="Comments"
          options={{ tabBarLabel: 'Comments' }}
        >
          {() => <CommentsTab userId={isOwnProfile ? auth.currentUser?.uid : dummyId} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}
