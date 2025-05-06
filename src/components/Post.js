import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, IconButton, Badge, Surface } from 'react-native-paper';

export default function Post({ postInfo }) {
  const {
    userImage,
    userName,
    datePosted,
    isFollowed,
    isEdited,
    isAIGenerated,
    postText,
    likeCount,
    commentCount,
    shareCount,
    onLike,
    onComment,
    onShare,
    onFollow,
  } = postInfo;

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: userImage }} style={styles.userImage} />
          <View style={styles.userDetails}>
            <Text variant="bodyMedium" style={styles.userName}>
              {userName}
            </Text>
            <Text variant="bodySmall" style={styles.datePosted}>
              {datePosted} {isEdited && <Text style={styles.edited}>(Edited)</Text>}
            </Text>
          </View>
          {isAIGenerated && (
            <Badge style={styles.badge} size={24}>
              AI
            </Badge>
          )}
          {!isAIGenerated && (
            <Badge style={[styles.badge, styles.selfWritten]} size={24}>
              Self
            </Badge>
          )}
        </View>
        {!isFollowed && (
          <IconButton
            icon="plus-circle"
            size={20}
            style={styles.followButton}
            onPress={onFollow}
          />
        )}
      </View>

      <Text variant="bodyMedium" style={styles.postText}>
        {postText}
      </Text>

      <View style={styles.footer}>
        <Button
          icon="thumb-up-outline"
          mode="text"
          onPress={onLike}
          contentStyle={styles.actionButton}
        >
          {likeCount}
        </Button>
        <Button
          icon="comment-outline"
          mode="text"
          onPress={onComment}
          contentStyle={styles.actionButton}
        >
          {commentCount}
        </Button>
        <Button
          icon="share-outline"
          mode="text"
          onPress={onShare}
          contentStyle={styles.actionButton}
        >
          {shareCount}
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  datePosted: {
    color: '#6b6b6b',
  },
  edited: {
    fontStyle: 'italic',
    color: '#6b6b6b',
  },
  badge: {
    backgroundColor: '#6200ee',
    color: 'white',
    marginLeft: 8,
  },
  selfWritten: {
    backgroundColor: '#03dac6',
  },
  followButton: {
    marginLeft: 8,
  },
  postText: {
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row-reverse',
  },
});