import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Pressable, ToastAndroid } from 'react-native';
import { Text, Button, Icon, Avatar, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function PostComponent({ postInfo }) {
  const navigation = useNavigation();

  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [localCommentCount, setLocalCommentCount] = useState(0);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  useEffect(() => {
    if (postInfo) {
      setIsLiked(postInfo.isLiked || false);
      setLocalLikeCount(postInfo.likeCount || 0);
      setLocalCommentCount(postInfo.commentCount || 0);
    }
  }, [postInfo]);

  const username = postInfo.user?.username || postInfo.username;
  const picture = postInfo.user?.picture || postInfo.picture; 

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLocalLikeCount(prev => (newLiked ? prev + 1 : prev - 1));
  };

  const handleComment = () => {
    if (comment.trim()) {
      setLocalCommentCount(prev => prev + 1);
      setComment('');
    }
    setShowCommentInput(false);
  };

  const handlePostPress = () => {
    navigation.navigate('Post', { pid: postInfo.pid });
  };

  const handleUserPress = () => {
    navigation.navigate('Profile', {
      userId: postInfo.userId,
      dummyId: postInfo.uid,
      isOwnProfile: false,
    });
  };

  return (
    <Pressable
      onPress={handlePostPress}
      style={{
        margin: 1,
        padding: 16,
        backgroundColor: '#ffffff',
        shadowColor: '#6200ee',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity onPress={handleUserPress}>
          <Avatar
            size={40}
            rounded
            source={{ uri: picture }}
            containerStyle={{ borderWidth: 2, borderRadius: 50, borderColor: '#6200ee' }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleUserPress}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                {username}
              </Text>
            </TouchableOpacity>
            {!postInfo.isFollowed && (
              <Button
                type="outline"
                buttonStyle={{
                  borderColor: '#6200ee',
                  backgroundColor: 'white',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
                title="Follow"
                titleStyle={{ fontSize: 10, color: '#6200ee' }}
                containerStyle={{ marginLeft: 8 }}
              />
            )}
          </View>
          <Text style={{ fontSize: 13, color: '#666666' }}>{postInfo.datePosted}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 15, lineHeight: 20, color: '#000', marginBottom: 16 }}>
        {postInfo.postText.split(' ').length > 30
          ? postInfo.postText.split(' ').slice(0, 30).join(' ') + '...'
          : postInfo.postText}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Button
          type="clear"
          icon={{
            name: isLiked ? 'heart' : 'heart-outline',
            type: 'material-community',
            size: 20,
            color: isLiked ? '#6200ee' : '#666666',
          }}
          iconRight
          title={localLikeCount.toString()}
          titleStyle={{ fontSize: 14, color: isLiked ? '#6200ee' : '#666666', marginRight: 4 }}
          onPress={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        />
        <Button
          type="clear"
          icon={{
            name: 'comment-outline',
            type: 'material-community',
            size: 20,
            color: '#666666',
          }}
          iconRight
          title={localCommentCount.toString()}
          titleStyle={{ fontSize: 14, color: '#666666', marginRight: 4 }}
          onPress={(e) => {
            e.stopPropagation();
            setShowCommentInput(!showCommentInput);
          }}
        />
        <Button
          type="clear"
          icon={{
            name: 'share-outline',
            type: 'material-community',
            size: 20,
            color: '#666666',
          }}
          onPress={() => {
            ToastAndroid.show('Shared', ToastAndroid.SHORT);
          }}
        />
      </View>
      {showCommentInput && (
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
          }}
        >
          <Input
            placeholder="Write a comment..."
            value={comment}
            onChangeText={setComment}
            containerStyle={{ flex: 1, marginBottom: 0 }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            rightIcon={
              <Icon
                name="send"
                type="material-community"
                color={comment.trim() ? '#6200ee' : '#cccccc'}
                size={24}
                onPress={handleComment}
              />
            }
          />
        </View>
      )}
    </Pressable>
  );
}