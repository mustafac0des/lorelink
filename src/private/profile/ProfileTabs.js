import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import PostComponent from '../home/PostComponent';
import {
  getUserPosts,
  getUserActivity,
  getUserProfile
} from '../../functions/dummyServices';

export function PostsTab({ userId }) {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!userId) throw new Error('User ID not provided');
  
        const rawPosts = await getUserPosts(userId);
        const enriched = await Promise.all(
          rawPosts.map(async p => {
            const user = await getUserProfile(userId);
            return {
              ...p,
              user: { name: user.name, picture: user.picture }
            };
          })
        );
        setPosts(enriched);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);
  

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6200ee" />
      <Text style={styles.loadingText}>Loading posts...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  if (!posts.length) return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Posts Yet!</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostComponent postInfo={item} />}
      keyExtractor={item => item.pid}
      contentContainerStyle={styles.listContainer}
    />
  );
}

export function CommentsTab({ userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!userId) throw new Error('User ID not provided');
  
        const { comments: raw } = await getUserActivity(userId);
        const enriched = await Promise.all(
          raw.map(async c => {
            const commenter = await getUserProfile(c.uid);
            return {
              ...c,
              userName: commenter.name,
              userImage: commenter.picture
            };
          })
        );
        setComments(enriched);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);
  

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6200ee" />
      <Text style={styles.loadingText}>Loading comments...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  if (!comments.length) return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Comments Yet!</Text>
    </View>
  );

  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => (
        <Pressable style={styles.cardContainer}>
          <View style={styles.headerContainer}>
            <Avatar
              size={40}
              rounded
              source={{ uri: item.userImage }}
              containerStyle={styles.avatar}
            />
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.dateText}>{item.datePosted}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>Commented on:</Text>
          <Text style={styles.commentText}>{item.postText}</Text>
          <Text style={styles.commentText}>{item.text}</Text>
          <View style={styles.actionContainer}>
            <Button
              type="clear"
              icon={{
                name: 'heart-outline',
                type: 'material-community',
                size: 15,
                color: '#666666'
              }}
              iconPosition='top'
              titleStyle={styles.likeButton}
            />
          </View>
        </Pressable>
      )}
      keyExtractor={item => item.pid + '_' + item.uid}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  loadingText: { marginTop: 10 },
  errorContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  errorText: { textAlign: 'center' },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  emptyText: { textAlign: 'center' },
  listContainer: { paddingVertical: 8 },
  cardContainer: {
    marginHorizontal: 12, marginVertical: 8, padding: 16,
    backgroundColor: '#fff', shadowColor: '#6200ee',
    shadowOpacity: 0.08, shadowRadius: 5, elevation: 5
  },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { borderWidth: 1, borderColor: '#6200ee' },
  userInfoContainer: { marginLeft: 12, flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#000' },
  dateText: { fontSize: 13, color: '#666666' },
  postTitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  commentText: {
    fontSize: 15, lineHeight: 20, color: '#000', marginBottom: 8
  },
  actionContainer: { flexDirection: 'row' },
  likeButton: { fontSize: 14, marginRight: 4 }
});
