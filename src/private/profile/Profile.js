import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { PostsTab, CommentsTab } from './ProfileTabs';
import { handleSignOut } from '../../functions/userService';
import { getUserProfile } from '../../functions/dummyServices';
import { useFocusEffect } from '@react-navigation/native';

import male_default from '../../../assets/male_default.jpg';
import female_default from '../../../assets/female_default.jpg';

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ route, navigation }) {
  const { dummyId, userId, isOwnProfile = false } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      if (dummyId != undefined) {
        const userData = await getUserProfile(dummyId)
        setProfileData(userData);
      }
      
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

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [userId, isOwnProfile])
  );

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={{width: "80%"}}>
            <Text h4>{profileData.name}</Text>
            <Text style={styles.username}>@{profileData.username}</Text>
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{profileData.biography}</Text>
            </View>
            <TouchableOpacity style={styles.statsContainer}>
              <Text style={styles.statsText}>0 followers</Text>
              <Text style={styles.statsText}>·</Text>
              <Text style={styles.statsText}>0 followings</Text>
            </TouchableOpacity>
          </View>
          <Avatar
            size={80}
            rounded
            source={profileData.picture !== 'null' ? { uri: profileData.picture } : (profileData.gender === 'male' ? male_default : female_default)}
            containerStyle={styles.avatarContainer}
          />
        </View>
        {isOwnProfile?
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
            <Button
              title="Edit profile"
              type="outline"
              onPress={() => navigation.navigate('Edit')}
              containerStyle={styles.editButtonContainer}
              buttonStyle={styles.editButton}
              titleStyle={styles.editButtonText}
            />
          </View>
        : 
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
          <Button
            title={profileData.isFollowed? 'Following' : 'Follow'}
            type="outline"
            onPress={() => setProfileData({ ...profileData, isFollowed: !profileData.isFollowed})}
            containerStyle={styles.editButtonContainer}
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
          />
      </View>}
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

const auth = getAuth();

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10
  },
  profileSection: {
    padding: 15
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  username: {
    color: '#666',
  },
  bioContainer: {
    marginVertical: 10
  },
  bioText: {
    color: '#666'
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 5
  },
  statsText: {
    color: '#666'
  },
  avatarContainer: {
    marginLeft: 0,
    borderColor: '#6200ee',
    borderWidth: 2
  },
  editButtonContainer: {
    flex: 1
  },
  editButton: {
    borderColor: '#6200ee',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10
  },
  editButtonText: {
    color: '#6200ee'
  }
};