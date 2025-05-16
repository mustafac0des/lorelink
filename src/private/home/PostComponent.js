import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
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

  const userImage = postInfo?.userImage || postInfo?.user?.picture || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
  const userName = postInfo?.userName || postInfo?.user?.name || 'Anonymous';
  const isFollowed = postInfo?.isFollowed || false;

  const {
    datePosted,
    postText,
    onShare,
  } = postInfo || {};

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLocalLikeCount(prev => newLiked ? prev + 1 : prev - 1);
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
    <Pressable onPress={handlePostPress} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUserPress}>
          <Avatar size={40} rounded source={{ uri: userImage }} containerStyle={{borderWidth: 2, borderRadius: 50, borderColor: '#6200ee'}} />
        </TouchableOpacity>
        <View style={styles.userDetails}>
          <View style={styles.nameRow}>
            <TouchableOpacity onPress={handleUserPress}>
              <Text style={styles.userName}>{userName}</Text>
            </TouchableOpacity>
            {!isFollowed && (
              <Button
                type="outline"
                buttonStyle={styles.followButton}
                title="Follow"
                titleStyle={styles.followTitle}
                containerStyle={styles.followContainer}
              />
            )}
          </View>
          <Text style={styles.dateText}>{datePosted}</Text>
        </View>
      </View>
      <Text style={styles.postText}>
        {postText.split(' ').length > 30
          ? postText.split(' ').slice(0, 30).join(' ') + '...'
          : postText}
      </Text>
      <View style={styles.actions}>
        <Button
          type="clear"
          icon={{
            name: isLiked ? 'heart' : 'heart-outline',
            type: 'material-community',
            size: 20,
            color: isLiked ? '#6200ee' : '#666666'
          }}
          iconRight
          title={localLikeCount.toString()}
          titleStyle={[styles.actionTitle, { color: isLiked ? '#6200ee' : '#666666' }]}
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
            color: '#666666'
          }}
          iconRight
          title={localCommentCount.toString()}
          titleStyle={styles.actionTitle}
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
            color: '#666666'
          }}
          onPress={(e) => {
            e.stopPropagation();
            onShare?.();
          }}
        />
      </View>
      {showCommentInput && (
        <View style={styles.commentBox}>
          <Input
            placeholder="Write a comment..."
            value={comment}
            onChangeText={setComment}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputInnerContainer}
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#6200ee',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  followButton: {
    borderColor: '#6200ee',
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  followTitle: {
    fontSize: 10,
    color: '#6200ee',
  },
  followContainer: {
    marginLeft: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#666666',
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  actionTitle: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  commentBox: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  inputInnerContainer: {
    borderBottomWidth: 0,
  },
});