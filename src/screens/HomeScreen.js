import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { ActivityIndicator, Surface } from 'react-native-paper';
import Post from '../components/Post';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = [
        {
          id: 1,
          userImage: 'https://example.com/user1.jpg',
          userName: 'John Doe',
          datePosted: '2 hours ago',
          isFollowed: true,
          isEdited: false,
          isAIGenerated: true,
          postText: 'This is an AI-generated post about the wonders of technology.',
          likeCount: 120,
          commentCount: 45,
          shareCount: 30,
          onLike: () => console.log('Liked post 1'),
          onComment: () => console.log('Commented on post 1'),
          onShare: () => console.log('Shared post 1'),
          onFollow: () => console.log('Followed user 1'),
        },
        {
          id: 2,
          userImage: 'https://example.com/user2.jpg',
          userName: 'Jane Smith',
          datePosted: '1 day ago',
          isFollowed: false,
          isEdited: true,
          isAIGenerated: false,
          postText: 'Here’s a self-written post about my recent trip to the mountains!',
          likeCount: 200,
          commentCount: 60,
          shareCount: 50,
          onLike: () => console.log('Liked post 2'),
          onComment: () => console.log('Commented on post 2'),
          onShare: () => console.log('Shared post 2'),
          onFollow: () => console.log('Followed user 2'),
        },
      ];
      setPosts(response);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </Surface>
    );
  }

  return (
    <ScrollView>
      {posts.map((postInfo) => (
        <Post key={postInfo.id} postInfo={postInfo} />
      ))}
    </ScrollView>
  );
}