import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { PostsTab, CommentsTab, LikesTab } from './ProfileTabs';
import { handleSignOut } from '../../functions/userService';

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ route, navigation }) {
  const { userId, isOwnProfile = false } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        const userDocRef = doc(db, 'users', isOwnProfile ? currentUser.uid : userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          ToastAndroid.show('Profile not found!', ToastAndroid.SHORT);
        }
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }

      setLoading(false);
    };
    fetchProfileData();
  }, [userId, isOwnProfile]);

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
    navigation.setOptions({
      headerRight: renderHeaderRight
    });
  }, [navigation, isOwnProfile]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  const username = profileData?.username || 'User';
  const displayName = profileData.name;
  const userBio = profileData?.biography;
  const followersCount = profileData?.followers?.length || 0;
  const followingsCount = profileData?.followings?.length || 0;
  // Handle profile image - could be base64 string or URL
  const profileImage = profileData?.picture !== 'null' ? profileData.picture : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text h4 style={{ marginBottom: 0 }}>{displayName}</Text>
            </View>
            <Text style={{ color: '#666', marginBottom: 10 }}>@{username}</Text>
            
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: '#666' }}>{userBio}</Text>
            </View>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={{ color: '#666' }}>{followersCount} followers</Text>
              <Text style={{ color: '#666' }}>·</Text>
              <Text style={{ color: '#666' }}>{followingsCount} following</Text>
            </TouchableOpacity>
          </View>

          <Avatar
            size={80}
            rounded
            source={{ uri: profileImage }}
            containerStyle={{ marginLeft: 15, borderColor: '#6200ee', borderWidth: 1}}
          />
        </View>

        {isOwnProfile && 
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
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
          </View>
        }
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
          tabBarIndicatorStyle: { backgroundColor: '#6200ee' },
        }}
      >
        <Tab.Screen 
          name="Posts" 
          options={{ tabBarLabel: 'Posts' }}
        >
          {() => <PostsTab userId={isOwnProfile ? auth.currentUser?.uid : userId} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Comments" 
          options={{ tabBarLabel: 'Comments' }}
        >
          {() => <CommentsTab userId={isOwnProfile ? auth.currentUser?.uid : userId} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Likes" 
          options={{ tabBarLabel: 'Likes' }}
        >
          {() => <LikesTab userId={isOwnProfile ? auth.currentUser?.uid : userId} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const auth = getAuth();