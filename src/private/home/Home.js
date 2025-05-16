import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl, ActivityIndicator, ToastAndroid } from 'react-native';
import { Text } from '@rneui/themed';
import PostComponent from './PostComponent';

import { DUMMY_POSTS, DUMMY_USERS } from '../../functions/dummyServices';

export default function Home () {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadPosts = () => {
      try {
        const postsWithUserData = DUMMY_POSTS.map(post => {
          const userData = DUMMY_USERS.find(user => user.uid === post.uid);
          return {
            ...post,
            userImage: userData?.picture || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
            userName: userData?.name,
            isFollowed: userData?.isFollowed,
            likeCount: Object.keys(post.likes || {}).length,
            commentCount: (post.comments || []).length
          };
        });

        setPosts(postsWithUserData);
        setLoading(false);
        setRefreshing(false);
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
        setLoading(false);
        setRefreshing(false);
      }
    };

    setTimeout(loadPosts, 1000);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const postsWithUserData = DUMMY_POSTS.map(post => {
        const userData = DUMMY_USERS.find(user => user.uid === post.uid);
        return {
          ...post,
          userImage: userData?.picture || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
          userName: userData?.name,
          isFollowed: userData?.isFollowed,
          likeCount: Object.keys(post.likes || {}).length,
          commentCount: (post.comments || []).length
        };
      });
      setPosts(postsWithUserData);
      setRefreshing(false);
    }, 1000); 
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6200ee']}
        />
      }
    >
      {posts.map((postInfo) => (
        <PostComponent key={postInfo.pid} postInfo={postInfo} />
      ))}
      {posts.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No stories to show!</Text>
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>You've reached the end!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20
  },
  loadingText: {
    marginTop: 10,
    color: '#666'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f7e3ff',
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
    shadowColor: '#6200ee',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },
  scrollViewContent: {
    paddingVertical: 8
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center'
  },
  messageText: {
    color: '#666',
    fontSize: 16
  }
});