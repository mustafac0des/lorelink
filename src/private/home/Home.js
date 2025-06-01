import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { Text } from '@rneui/themed';
import PostComponent from './PostComponent';
import { loadPosts, checkUserProfile } from '../../backend/Services';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const loadedPosts = await loadPosts();
        setPosts(loadedPosts);
        await checkUserProfile();
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          paddingTop: 20,
        }}
      >
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading stories...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#f7e3ff',
        borderRadius: 20,
        margin: 10,
        overflow: 'hidden',
        shadowColor: '#6200ee',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      {posts.map((postInfo) => (
        <PostComponent key={postInfo.pid} postInfo={postInfo} />
      ))}
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: '#666', fontSize: 16 }}>
          {posts.length === 0 ? 'No stories to show!' : "You've reached the end!"}
        </Text>
      </View>
    </ScrollView>
  );
}