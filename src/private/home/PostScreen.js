import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Input, Button, Icon, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { getPost } from '../../functions/dummyServices';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const DEFAULT_AVATAR = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

export default function PostScreen({ route }) {
  const navigation = useNavigation();
  const { pid } = route.params;

  const [postInfo, setPostInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');

  const toggleLiked = () => {
    setLiked(prev => !prev);
    setLocalLikeCount(prev => liked ? prev - 1 : prev + 1);
  }

  useEffect(() => {
    const info = getPost(pid);
    setPostInfo(info);
    setComments(info?.comments || []);
    setLocalLikeCount(info?.likeCount || 0);
  }, [pid]);

  const handleUserPress = (userInfo) => {
    navigation.navigate('Profile', {
      userId: postInfo.userId,
      dummyId: postInfo.uid,
      isOwnProfile: false,
    });
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();

      const newComment = {
        id: Date.now().toString(),
        userName: userData?.name || 'Anonymous',
        userImage: userData?.picture || DEFAULT_AVATAR,
        text: commentText.trim(),
        timestamp: new Date().toLocaleString(),
      };

      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!postInfo) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => handleUserPress(postInfo.user)}>
            <Avatar
              size={40}
              rounded
              source={{ uri: postInfo.user.picture || DEFAULT_AVATAR }}
              containerStyle={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <TouchableOpacity onPress={() => handleUserPress(postInfo.user)}>
              <Text style={styles.userName}>{postInfo.user.username}</Text>
            </TouchableOpacity>
            <Text style={styles.datePosted}>{postInfo.datePosted}</Text>
          </View>
        </View>
        <Text style={styles.postText}>{postInfo.postText}</Text>
        <View style={styles.actionContainer}>
          <Button
            type="clear"
            icon={{
              name: liked ? 'heart' : 'heart-outline',
              type: 'material-community',
              size: 20,
              color: liked ? '#6200ee' : '#666666'
            }}
            iconRight
            title={localLikeCount.toString()}
            titleStyle={[styles.actionText, { color: liked ? '#6200ee' : '#666666' }]}
            onPress={toggleLiked}
          />
          <Button
            type="clear"
            icon={{ name: 'comment-outline', type: 'material-community', size: 20 }}
            iconRight
            title={comments.length.toString()}
            titleStyle={styles.actionText}
          />
          <Button type="clear" icon={{ name: 'share-outline', type: 'material-community', size: 20 }} />
        </View>
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeader}>Comments ({comments.length})</Text>
          {comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <TouchableOpacity onPress={() => handleUserPress(comment)}>
                <Avatar
                  size={32}
                  rounded
                  source={{ uri: comment.userPicture || DEFAULT_AVATAR }}
                  containerStyle={styles.avatar}
                />
              </TouchableOpacity>
              <View style={styles.commentTextContainer}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUserName}>{comment.username}</Text>
                  <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.addCommentContainer}>
        <Input
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
          rightIcon={<Icon name="send" color={"#6200ee"} type="material-community" size={24} onPress={handleComment} />}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
    shadowColor: '#6200ee',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  avatar: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  datePosted: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  commentsContainer: {
    padding: 16,
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#f0f0f0',
    paddingBottom: 16,
  },
  commentTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#000',
  },
  addCommentContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#f7e3ff',
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
});

