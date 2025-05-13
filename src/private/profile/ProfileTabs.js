import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Text } from '@rneui/themed';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import HomePost from '../home/HomePost';

export function PostsTab({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        
        if (!userId) {
          setError('User ID not provided');
          return;
        }

        // Get user data from Firestore
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        let userData = null;
        
        if (userDocSnap.exists()) {
          userData = userDocSnap.data();
        }

        // Mock posts with actual user data
        const mockPosts = [
          {
            id: 1,
            userId: userId,
            userImage: userData?.picture !== 'null' ? userData.picture : 'https://randomuser.me/api/portraits/men/32.jpg',
            userName: userData?.username || 'User',
            datePosted: '2h',
            isFollowed: true,
            isGenerated: true,
            postText: 'Just finished my latest story about a magical library where books come to life at night. What do you think about this premise?',
            likeCount: 24,
            commentCount: 8,
          },
          {
            id: 2,
            userId: userId,
            userImage: userData?.picture !== 'null' ? userData.picture : 'https://randomuser.me/api/portraits/men/32.jpg',
            userName: userData?.username || 'User',
            datePosted: '1d',
            isFollowed: true,
            isGenerated: false,
            postText: 'Working on a new series about time-traveling historians. Here\'s a sneak peek of chapter one!',
            likeCount: 42,
            commentCount: 15,
          }
        ];

        setPosts(mockPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10 }}>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center' }}>No posts yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <HomePost postInfo={item} />}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

export function CommentsTab({ userId }) {
  const comments = [
    {
      id: 1,
      postTitle: "The Enchanted Library",
      postAuthor: "Sarah Williams",
      comment: "This is such a creative concept! I particularly loved the character development.",
      datePosted: "1d",
      likes: 12
    },
    {
      id: 2,
      postTitle: "Time Travelers' Chronicles",
      postAuthor: "Mike Johnson",
      comment: "The historical accuracy in this piece is impressive. Looking forward to the next chapter!",
      datePosted: "3d",
      likes: 8
    }
  ];

  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
            {item.postTitle}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            by {item.postAuthor}
          </Text>
          <Text style={{ fontSize: 15, marginBottom: 8 }}>
            {item.comment}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {item.datePosted} • {item.likes} likes
          </Text>
        </View>
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}

export function LikesTab({ userId }) {
  const likes = [
    {
      id: 1,
      type: 'post',
      title: "The Art of Worldbuilding",
      author: "Emma Thompson",
      preview: "Creating believable fantasy worlds requires attention to detail...",
      datePosted: "2d",
      likes: 156
    },
    {
      id: 2,
      type: 'comment',
      postTitle: "Character Development Guide",
      comment: "These tips really helped me flesh out my protagonist!",
      author: "David Chen",
      datePosted: "4d",
      likes: 45
    }
  ];

  return (
    <FlatList
      data={likes}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            {item.type === 'post' ? 'Liked post' : 'Liked comment'}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
            {item.type === 'post' ? item.title : item.postTitle}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            by {item.author}
          </Text>
          {item.type === 'post' && (
            <Text style={{ fontSize: 15, marginBottom: 8 }} numberOfLines={2}>
              {item.preview}
            </Text>
          )}
          {item.type === 'comment' && (
            <Text style={{ fontSize: 15, marginBottom: 8 }}>
              {item.comment}
            </Text>
          )}
          <Text style={{ fontSize: 12, color: '#666' }}>
            {item.datePosted} • {item.likes} likes
          </Text>
        </View>
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}