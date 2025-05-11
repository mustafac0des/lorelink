import React, { useState, useEffect } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Text } from '@rneui/themed';
import Post from '../../components/home/Posts';
import { fetchPosts } from '../../functions/postService';
import { Button } from '@rneui/base';
import { auth, db } from '../../../firebaseConfig';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  

const loadPosts = async () => {
    const response = await fetchPosts();
    setPosts(response);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = React.useCallback(() => {
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
        <Text h4>Loading stories...</Text>
      </View>
    );
  }

  const func = async () => {
    console.log("clicked");
    const { email } = auth.currentUser;
    const data = () => {
      return {
        username: email.split('@')[0],
        email: email,
        biography: "Hey There, I am using Lorelink!",
        followers: [],
        followings: [],
        name: "null",
        picture: "null"
      };
    };

    await setDoc(doc(db, 'users', auth.currentUser.uid), data());
    ToastAndroid.show('Signed up successfully!', ToastAndroid.SHORT);
    console.log("UID:", auth.currentUser.uid);
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
        <Post key={postInfo.id} postInfo={postInfo} />
      ))}
      {posts.length === 0 ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#666', fontSize: 16 }}>No stories to show!</Text>
        </View>
      ) : (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#666', fontSize: 16 }}>You've reached the end!</Text>
          <Button onPress={func} >click mee</Button>
        </View>
      )}
    </ScrollView>
  );
}