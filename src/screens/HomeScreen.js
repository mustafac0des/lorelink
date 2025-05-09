import React, { useState, useEffect } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Text } from '@rneui/themed';
import Post from '../components/Post';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    // Simulated API call
    const response = [
      {
        id: 1,
        userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        userName: 'John Doe',
        datePosted: '2h',
        isFollowed: true,
        isGenerated: true,
        isEdited: false,
        postText: 'Took the time btw last night and today to reset all my yearly goals bc I haven\'t made the progress I wanted. But instead of feeling bad about it, I just...adjusted the goals, added new events & planning stuff and then moved on.',
        likeCount: 8,
        commentCount: 4,
        shareCount: 0,
        onLike: () => console.log('Liked post 1'),
        onComment: () => console.log('Commented on post 1'),
        onShare: () => console.log('Shared post 1'),
        onFollow: () => console.log('Followed user 1'),
      },
      {
        id: 2,
        userImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        userName: 'Jane Smith',
        datePosted: '4h',
        isFollowed: false,
        isGenerated: false,
        isEdited: true,
        postText: 'Just finished writing my first AI-assisted story! The creative possibilities are endless. What do you think about AI in storytelling?',
        likeCount: 15,
        commentCount: 7,
        shareCount: 2,
        onLike: () => console.log('Liked post 2'),
        onComment: () => console.log('Commented on post 2'),
        onShare: () => console.log('Shared post 2'),
        onFollow: () => console.log('Followed user 2'),
      },
    ];
    setPosts(response);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
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
        <Post key={postInfo.id} postInfo={postInfo} />
      ))}
    </ScrollView>
  );
}