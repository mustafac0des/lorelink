import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Text, Button, Avatar, Icon } from '@rneui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PostsTab, CommentsTab, LikesTab } from '../components/profile/ProfileTabs';

const Tab = createMaterialTopTabNavigator();

export default function UserProfileScreen({ route, navigation, setIsLoggedIn }) {
  const { userId, userName, userImage, isOwnProfile = false } = route.params;
  const [isFollowed, setIsFollowed] = useState(route.params.isFollowed || false);

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
  };

  const renderActionButtons = () => {
    if (isOwnProfile) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            title="Edit profile"
            type="outline"
            onPress={() => navigation.navigate('EditProfile')}
            containerStyle={styles.editButton}
            buttonStyle={[styles.button, styles.secondaryButton]}
            titleStyle={styles.secondaryButtonText}
          />
          <Button
            title="Settings"
            type="outline"
            onPress={() => navigation.navigate('Settings')}
            containerStyle={styles.shareButton}
            buttonStyle={[styles.button, styles.secondaryButton]}
            titleStyle={styles.secondaryButtonText}
          />
        </View>
      );
    }

    return (
      <View style={styles.buttonContainer}>
        <Button
          title={isFollowed ? "Following" : "Follow"}
          type="solid"
          onPress={handleFollow}
          containerStyle={styles.followButton}
          buttonStyle={[
            styles.button,
            isFollowed ? styles.followingButton : styles.primaryButton
          ]}
          titleStyle={[
            styles.buttonText,
            isFollowed && styles.followingButtonText
          ]}
        />
        <Button
          title="Mention"
          type="outline"
          containerStyle={styles.mentionButton}
          buttonStyle={[styles.button, styles.secondaryButton]}
          titleStyle={styles.secondaryButtonText}
        />
      </View>
    );
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
          onPress={() => setIsLoggedIn?.(false)}
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{userName}</Text>
              <Icon
                name="checkbox-marked-circle"
                type="material-community"
                size={16}
                color="#0095F6"
              />
            </View>
            <Text style={styles.username}>@{userName.toLowerCase().replace(/\s/g, '_')}</Text>
            
            <View style={styles.businessInfo}>
              <Text style={styles.infoText}>Writer | Story Enthusiasdddsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssdt</Text>
            </View>

            <TouchableOpacity style={styles.followersRow}>
              <Text style={styles.followersText}>256 followers</Text>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.followersText}>123 interactions</Text>
            </TouchableOpacity>
          </View>

          <Avatar
            size={80}
            rounded
            source={{ uri: userImage }}
            containerStyle={styles.avatar}
          />
        </View>

        {renderActionButtons()}
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#666',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
    marginRight: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 4,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  businessInfo: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  followersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  followersText: {
    fontSize: 14,
    color: '#666',
  },
  dotSeparator: {
    marginHorizontal: 4,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  socialLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  followButton: {
    flex: 1,
    marginRight: 8,
  },
  mentionButton: {
    flex: 1,
    marginLeft: 8,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  shareButton: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    height: 36,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#000',
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#000',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabel: {
    textTransform: 'none',
    fontSize: 14,
    fontWeight: '600',
  },
  tabIndicator: {
    backgroundColor: '#000',
  },
});