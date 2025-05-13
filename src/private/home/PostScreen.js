import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Input, Button, Icon, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function PostScreen({ route }) {
  const navigation = useNavigation();
  const { postInfo } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      userId: 'user1',
      userImage: 'https://randomuser.me/api/portraits/men/43.jpg',
      userName: 'Mike Johnson',
      text: 'Great perspective! I totally agree with adjusting goals rather than giving up.',
      timestamp: '1h',
    },
    {
      id: 2,
      userId: 'user2',
      userImage: 'https://randomuser.me/api/portraits/women/33.jpg',
      userName: 'Sarah Williams',
      text: 'This is exactly what I needed to hear today. Thanks for sharing!',
      timestamp: '30m',
    },
  ]);

  const handleUserPress = (user) => {
    navigation.navigate('UserProfile', {
      userId: user.userId,
      userName: user.userName,
      userImage: user.userImage,
      isFollowed: false, // This would typically come from your user state/API
    });
  };

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        userId: 'currentUser',
        userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        userName: 'You',
        text: comment,
        timestamp: 'Just now',
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView>
        <View style={{ padding: 16 }}>
          {/* Post Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <TouchableOpacity onPress={() => handleUserPress(postInfo)}>
              <Avatar
                size={40}
                rounded
                source={{ uri: postInfo.userImage }}
                borderColor="#6200ee"
                borderWidth={1}
                containerStyle={{ borderRadius: 50 }}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleUserPress(postInfo)}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                    {postInfo.userName}
                  </Text>
                </TouchableOpacity>
                {!postInfo.isFollowed && (
                  <Button
                    type="outline"
                    buttonStyle={{ borderColor: '#6200ee', backgroundColor: 'white', paddingHorizontal: 6, paddingVertical: 2 }}
                    title="Follow"
                    titleStyle={{ fontSize: 10, color: '#6200ee'}}
                    containerStyle={{ marginLeft: 8 }}
                    onPress={postInfo.onFollow}
                  />
                )}
              </View>
              <Text style={{ fontSize: 13, color: '#666666' }}>
                {postInfo.datePosted} {postInfo.isGenerated ? '• Generated' : '• Human'} {postInfo.isEdited && '• Edited'}
              </Text>
            </View>
          </View>

          {/* Post Content */}
          <Text style={{ fontSize: 15, lineHeight: 20, color: '#000', marginBottom: 16 }}>
            {postInfo.postText}
          </Text>

          {/* Interaction Buttons */}
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingVertical: 8 }}>
            <Button
              type="clear"
              icon={{
                name: 'heart-outline',
                type: 'material-community',
                size: 20,
                color: '#666666'
              }}
              iconRight
              title={postInfo.likeCount.toString()}
              titleStyle={{ fontSize: 14, color: '#666666', marginRight: 4 }}
              onPress={postInfo.onLike}
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
              title={postInfo.commentCount.toString()}
              titleStyle={{ fontSize: 14, color: '#666666', marginRight: 4 }}
            />
            <Button
              type="clear"
              icon={{
                name: 'share-outline',
                type: 'material-community',
                size: 20,
                color: '#666666'
              }}
              onPress={postInfo.onShare}
            />
          </View>
        </View>

        {/* Comments Section */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
            Comments ({comments.length})
          </Text>
          
          {comments.map(comment => (
            <View key={comment.id} style={{ marginBottom: 16, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleUserPress(comment)}>
                <Avatar
                  size={32}
                  rounded
                  source={{ uri: comment.userImage }}
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => handleUserPress(comment)}>
                    <Text style={{ fontSize: 14, fontWeight: '600' }}>
                      {comment.userName}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 12, color: '#666666', marginLeft: 8 }}>
                    {comment.timestamp}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: '#000000', marginTop: 4 }}>
                  {comment.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={{ padding: 16, margin: 10, borderRadius: 10, borderWidth: 0.5, borderColor: '#6200ee', backgroundColor: '#f0f0f0' }}>
        <Input
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
          rightIcon={
            <Icon
              name="send"
              type="material-community"
              color={comment.trim() ? '#6200ee' : '#cccccc'}
              size={24}
              onPress={handleComment}

            />
          }
          containerStyle={{ marginBottom: -8 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
      </View>
    </View>
  );
}