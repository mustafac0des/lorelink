import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, RefreshControl, ActivityIndicator, ToastAndroid } from 'react-native';
import { Text } from '@rneui/themed';

import PostComponent from './PostComponent'; 
import { getHomePosts } from '../../functions/dummyServices'; 

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = () => {
    try {
      const dummyData = getHomePosts();
      setPosts(dummyData);
    } catch (err) {
      console.error('Error loading dummy posts:', err);
      ToastAndroid.show('Failed to load posts', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, []);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingTop: 20
      }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading stories...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        overflow: 'hidden'
      }}
      contentContainerStyle={{ paddingVertical: 8 }}
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
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#666', fontSize: 16 }}>No stories to show!</Text>
        </View>
      ) : (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#666', fontSize: 16 }}>You've reached the end!</Text>
        </View>
      )}
    </ScrollView>
  );
}
