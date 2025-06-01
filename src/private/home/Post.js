import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { Text, Input, Button, Icon, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { getPost } from '../../backend/Services';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';

const DEFAULT_AVATAR = 'https://example.com/default-avatar.png'; 

export default function Post({ route }) {
  const navigation = useNavigation();
  const { pid } = route.params;

  const [postInfo, setPostInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const info = await getPost(pid);
        setPostInfo(info);
        setComments(info?.comments || []);
        setLocalLikeCount(info?.likeCount || 0);
      } catch (error) {
        console.error('Failed to load post:', error);
      }
    }
    fetchPost();
  }, [pid]);

  const toggleLiked = () => {
    setLiked(prevLiked => {
      setLocalLikeCount(prevCount => (prevLiked ? prevCount - 1 : prevCount + 1));
      return !prevLiked;
    });
  };

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
      if (!currentUser) return;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();

      const newComment = {
        id: Date.now().toString(),
        username: userData?.username || 'Unknown',
        userImage: userData?.picture || DEFAULT_AVATAR,
        text: commentText.trim(),
        timestamp: new Date().toLocaleString(),
      };

      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.LONG);
    }
  };

  if (!postInfo) return null;

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 20,
      margin: 10,
      overflow: 'hidden',
      shadowColor: '#6200ee',
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 5,
    }}>
      <ScrollView>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderColor: '#f0f0f0',
        }}>
          <TouchableOpacity onPress={() => handleUserPress(postInfo.user)}>
            <Avatar
              size={40}
              rounded
              source={{ uri: postInfo.user.picture || DEFAULT_AVATAR }}
              containerStyle={{
                borderRadius: 50,
                borderWidth: 2,
                borderColor: '#6200ee',
              }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <TouchableOpacity onPress={() => handleUserPress(postInfo.user)}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                {postInfo.user.username}
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
              {postInfo.datePosted}
            </Text>
          </View>
        </View>

        <Text style={{
          fontSize: 15,
          lineHeight: 20,
          color: '#000',
          paddingHorizontal: 16,
          paddingVertical: 10,
          marginTop: 8,
        }}>
          {postInfo.postText}
        </Text>

        <View style={{
          flexDirection: 'row',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#f0f0f0',
        }}>
          <Button
            type="clear"
            icon={{
              name: liked ? 'heart' : 'heart-outline',
              type: 'material-community',
              size: 20,
              color: liked ? '#6200ee' : '#666666',
            }}
            iconRight
            title={localLikeCount.toString()}
            titleStyle={{ fontSize: 14, color: liked ? '#6200ee' : '#666666', marginLeft: 4 }}
            onPress={toggleLiked}
          />
          <Button
            type="clear"
            icon={{ name: 'comment-outline', type: 'material-community', size: 20 }}
            iconRight
            title={comments.length.toString()}
            titleStyle={{ fontSize: 14, color: '#666', marginLeft: 4 }}
          />
          <Button
            type="clear"
            icon={{ name: 'share-outline', type: 'material-community', size: 20 }}
          />
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
            Comments ({comments.length})
          </Text>
          {comments.map(comment => (
            <View
              key={comment.id}
              style={{
                flexDirection: 'row',
                marginBottom: 16,
                alignItems: 'center',
                borderBottomWidth: 0.5,
                borderColor: '#f0f0f0',
                paddingBottom: 16,
              }}
            >
              <TouchableOpacity onPress={() => handleUserPress(comment)}>
                <Avatar
                  size={32}
                  rounded
                  source={{ uri: comment.userPicture || comment.userImage || DEFAULT_AVATAR }}
                  containerStyle={{
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#6200ee',
                  }}
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600' }}>{comment.username}</Text>
                  <Text style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>{comment.timestamp}</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#000' }}>{comment.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderTopWidth: 1,
        borderColor: '#f7e3ff',
      }}>
        <Input
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
          rightIcon={
            <Icon
              name="send"
              color="#6200ee"
              type="material-community"
              size={24}
              onPress={handleComment}
            />
          }
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
      </View>
    </View>
  );
}
