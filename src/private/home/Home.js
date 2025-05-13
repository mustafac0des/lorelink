import React, { useState, useEffect } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Text } from '@rneui/themed';
import HomePost from './HomePost';
import { fetchPosts } from '../../functions/postService';

export default function Home () {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const loadPosts = async () => {
      try {
        setError(null);
        unsubscribe = await fetchPosts((updatedPosts) => {
          setPosts(updatedPosts);
          setLoading(false);
          setRefreshing(false);
        });
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('Failed to load posts. Please try again.');
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setError(null);
    // The real-time listener will automatically update the posts
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
        <Text h4>Loading stories...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 10, overflow: 'hidden', backgroundColor: '#f8f8f8' }}
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
        <HomePost key={postInfo.pid} postInfo={postInfo} />
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