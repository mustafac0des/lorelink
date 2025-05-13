import React, { useState } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { Text, Button, Icon, Avatar, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { toggleLike, addComment } from '../../functions/postService';

const WORD_LIMIT = 30; // Approximately 200 words

export default function HomePost({ postInfo }) {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [localCommentCount, setLocalCommentCount] = useState(0);
  
  const {
    id,
    userImage,
    userName,
    datePosted,
    isFollowed,
    isGenerated,
    postText,
    likeCount,
    commentCount,
    onShare,
    onFollow,
  } = postInfo;

  useEffect(() => {
    setLocalLikeCount(likeCount || 0);
    setLocalCommentCount(commentCount || 0);
  }, [likeCount, commentCount]);

  const words = postText.split(' ');
  const shouldTruncate = words.length > WORD_LIMIT;
  const displayText = isExpanded || !shouldTruncate 
    ? postText 
    : words.slice(0, WORD_LIMIT).join(' ') + '...';

  const handleLike = async () => {
    try {
      const result = await toggleLike(id);
      setIsLiked(result);
      setLocalLikeCount(prev => result ? prev + 1 : Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (comment.trim()) {
      try {
        const commentId = await addComment(id, comment.trim());
        if (commentId) {
          setLocalCommentCount(prev => prev + 1);
          setComment('');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
    setShowCommentInput(false);
  };

  const handlePostPress = () => {
    navigation.navigate('Post', { postInfo });
  };

  const handleUserPress = () => {
    navigation.navigate('UserProfile', {
      userId: postInfo.userId || id,
      userName: userName,
      userImage: userImage,
      isOwnProfile: false,
      isFollowed: isFollowed
    });
  };

  return (
    <Pressable 
      onPress={handlePostPress}
      style={{
        marginHorizontal: 12,
        marginVertical: 0,
        padding: 16,
        backgroundColor: '#ffffff',
        shadowColor: '#6200ee',
        shadowOffset: { width: 0, height: 1 },
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
            source={{ uri: userImage }}
            borderRadius={20}
            borderColor="#6200ee"
            borderWidth={1}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleUserPress}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                {userName}
              </Text>
            </TouchableOpacity>
            {!isFollowed && (
              <Button
                type="outline"
                buttonStyle={{ borderColor: '#6200ee', backgroundColor: 'white', paddingHorizontal: 6, paddingVertical: 2 }}
                title="Follow"
                titleStyle={{ fontSize: 10, color: '#6200ee'}}
                containerStyle={{ marginLeft: 8 }}
                onPress={(e) => {
                  e.stopPropagation();
                  onFollow?.();
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 13, color: '#666666' }}>
            {datePosted} {isGenerated ? '• Generated' : '• Human'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        activeOpacity={shouldTruncate ? 0.7 : 1}
        onPress={() => shouldTruncate && setIsExpanded(!isExpanded)}
      >
        <Text style={{ fontSize: 15, lineHeight: 20, color: '#000', marginBottom: shouldTruncate ? 8 : 16 }}>
          {displayText}
        </Text>
        {shouldTruncate && !isExpanded && (
          <Text style={{ color: '#6200ee', fontSize: 14 }}>
            Read more
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row' }}>
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
            color: '#666666'
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
            color: '#666666'
          }}
          onPress={(e) => {
            e.stopPropagation();
            onShare?.();
          }}
        />
      </View>

      {showCommentInput && (
        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, }}>
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