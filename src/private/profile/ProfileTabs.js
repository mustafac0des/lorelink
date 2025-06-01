import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Text, Avatar } from '@rneui/themed';
import PostComponent from '../home/PostComponent';
import { getUserPosts, getUserActivity } from '../../backend/Services';

export function PostsTab({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const posts = await getUserPosts(userId);
      setPosts(posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ActivityIndicator size="large" color="#6200ee" />
      <Text style={{ marginTop: 10 }}>Loading posts...</Text>
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ textAlign: 'center' }}>{error}</Text>
    </View>
  );

  if (!posts.length) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ textAlign: 'center' }}>No Posts Yet!</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostComponent postInfo={item} />}
      keyExtractor={item => item.pid}
      contentContainerStyle={{
        margin: 10,
        borderRadius: 20,
        backgroundColor: "#f7e3ff",
        overflow: "hidden",
        shadowColor: '#6200ee',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 5,
        height: "95%",
      }}
    />
  );
}

export function CommentsTab({ userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const comments = await getUserActivity(userId);
        setComments(comments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);  

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ActivityIndicator size="large" color="#6200ee" />
      <Text style={{ marginTop: 10 }}>Loading comments...</Text>
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ textAlign: 'center' }}>{error}</Text>
    </View>
  );

  if (!comments.length) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ textAlign: 'center' }}>No Comments Yet!</Text>
    </View>
  );

  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => (
        <Pressable style={{
          padding: 16,
          backgroundColor: '#fff',
          shadowColor: '#6200ee',
          shadowOpacity: 0.08,
          shadowRadius: 5,
          elevation: 5,
          marginBottom: 1,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, }}>
            <Avatar
              size={40}
              rounded
              source={{ uri: item.userImage }}
              containerStyle={{ borderWidth: 1, borderColor: '#6200ee' }}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>{item.userName}</Text>
              <Text style={{ fontSize: 13, color: '#666666' }}>{item.dateCommented}</Text>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
              Commented on: <Text style={{ color: '#6200ee', fontStyle: 'italic' }}>{item.postText.length > 30 ? item.postText.substring(0, 30) + '...' : item.postText}</Text>
            </Text>
            <Text style={{
              fontSize: 15,
              lineHeight: 20,
              color: '#000',
              marginBottom: 8
            }}>{item.text}</Text>
          </View>
        </Pressable>
      )}
      keyExtractor={item => item.pid + '_' + item.uid}
      contentContainerStyle={{
        margin: 10,
        borderRadius: 20,
        backgroundColor: "#f7e3ff",
        overflow: "hidden",
        shadowColor: '#6200ee',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 5
      }}
    />
  );
}