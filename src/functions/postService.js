import { collection, addDoc, getDocs, serverTimestamp, doc, updateDoc, deleteDoc, getDoc, query, where, orderBy, limit, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { ToastAndroid } from 'react-native';

// Error messages
const ERRORS = {
  UNAUTHORIZED: 'User must be authenticated to perform this action',
  POST_NOT_FOUND: 'Post not found',
  INVALID_INPUT: 'Invalid input parameters',
  SERVER_ERROR: 'An unexpected error occurred'
};

// Validate post data
const validatePost = (postData) => {
  if (!postData.postText || postData.postText.trim().length === 0) {
    throw new Error('Post text cannot be empty');
  }
  if (postData.postText.length > 2000) {
    throw new Error('Post text exceeds maximum length of 2000 characters');
  }
};

// Format date helper
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
};

export const createPost = async ({ postText, isGenerated = false }) => {
  if (!auth.currentUser) {
    ToastAndroid.show(ERRORS.UNAUTHORIZED, ToastAndroid.SHORT);
    throw new Error(ERRORS.UNAUTHORIZED);
  }

  try {
    validatePost({ postText });
    
    const postData = {
      userId: auth.currentUser.uid,
      postText,
      isGenerated,
      likeCount: 0,
      commentCount: 0,
      datePosted: serverTimestamp()
    };

    const postRef = await addDoc(collection(db, 'posts'), postData);
    ToastAndroid.show('Post created successfully!', ToastAndroid.SHORT);
    return postRef.id;
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
    return null;
  }
};

// Fetch posts with real-time updates
// Format post data with user information
const formatPostWithUser = async (postDoc) => {
  try {
    const postData = postDoc.data();
    const userDoc = await getDoc(doc(db, 'users', postData.userId));
    const userData = userDoc.data() || {};

    return {
      id: postDoc.id,
      userId: postData.userId,
      userImage: userData.picture || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      userName: userData.username || 'User',
      datePosted: formatDate(postData.datePosted),
      isGenerated: postData.isGenerated || false,
      postText: postData.postText,
      likeCount: postData.likeCount || 0,
      commentCount: postData.commentCount || 0
    };
  } catch (error) {
    console.error('Error formatting post:', error);
    return null;
  }
};

// Fetch posts with real-time updates
export const fetchPosts = async (callback) => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('datePosted', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const posts = [];
      const processedDocs = new Set();
      
      for (const change of snapshot.docChanges()) {
        if (processedDocs.has(change.doc.id)) continue;
        
        const formattedPost = await formatPostWithUser(change.doc);
        if (!formattedPost) continue;

        processedDocs.add(change.doc.id);

        switch (change.type) {
          case 'added':
            posts.push(formattedPost);
            break;
          case 'modified':
            const index = posts.findIndex(p => p.id === change.doc.id);
            if (index !== -1) posts[index] = formattedPost;
            else posts.push(formattedPost);
            break;
          case 'removed':
            const removeIndex = posts.findIndex(p => p.id === change.doc.id);
            if (removeIndex !== -1) posts.splice(removeIndex, 1);
            break;
        }
      }

      callback(posts);
    }, (error) => {
      console.error('Error in posts listener:', error);
      ToastAndroid.show(ERRORS.SERVER_ERROR, ToastAndroid.SHORT);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    ToastAndroid.show(ERRORS.SERVER_ERROR, ToastAndroid.SHORT);
    return () => {};
  }
};
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
    return [];
  }
};

// Add a comment to a post with validation
export const addComment = async (postId, commentText) => {
  if (!auth.currentUser) {
    ToastAndroid.show(ERRORS.UNAUTHORIZED, ToastAndroid.SHORT);
    throw new Error(ERRORS.UNAUTHORIZED);
  }

  if (!commentText || commentText.trim().length === 0) {
    ToastAndroid.show('Comment text cannot be empty', ToastAndroid.SHORT);
    throw new Error(ERRORS.INVALID_INPUT);
  }

  try {
    const commentData = {
      userId: auth.currentUser.uid,
      postId,
      commentText,
      dateCreated: serverTimestamp()
    };

    // Add comment to comments collection
    const commentRef = await addDoc(collection(db, 'comments'), commentData);

    // Update post's comment count
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      await updateDoc(postRef, {
        commentCount: (postDoc.data().commentCount || 0) + 1
      });
    }

    return commentRef.id;
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
    return null;
  }
};

// Toggle like on a post with optimistic updates
export const toggleLike = async (postId) => {
  if (!auth.currentUser) {
    ToastAndroid.show(ERRORS.UNAUTHORIZED, ToastAndroid.SHORT);
    throw new Error(ERRORS.UNAUTHORIZED);
  }

  const userId = auth.currentUser.uid;
  const likeDocId = `${postId}_${userId}`;
  const likeRef = doc(db, 'likes', likeDocId);

  try {
    // Check if post exists first
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      ToastAndroid.show(ERRORS.POST_NOT_FOUND, ToastAndroid.SHORT);
      return false;
    }

    const likeDoc = await getDoc(likeRef);
    const currentLikeCount = postDoc.data().likeCount || 0;

    if (likeDoc.exists()) {
      // Remove like
      await deleteDoc(likeRef);
      await updateDoc(postRef, {
        likeCount: Math.max(currentLikeCount - 1, 0)
      });
      return false;
    } else {
      // Add like
      await setDoc(likeRef, {
        userId,
        postId,
        dateCreated: serverTimestamp()
      });
      await updateDoc(postRef, {
        likeCount: currentLikeCount + 1
      });
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    ToastAndroid.show(error.message || ERRORS.SERVER_ERROR, ToastAndroid.SHORT);
    return false;
  }
}
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
    return false;
  }
};

// Format comment with user information
const formatCommentWithUser = async (commentDoc) => {
  try {
    const commentData = commentDoc.data();
    const userDoc = await getDoc(doc(db, 'users', commentData.userId));
    const userData = userDoc.data() || {};

    return {
      id: commentDoc.id,
      userId: commentData.userId,
      userImage: userData.picture || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      userName: userData.username || 'User',
      commentText: commentData.commentText,
      dateCreated: commentData.dateCreated?.toDate().toLocaleString()
    };
  } catch (error) {
    console.error('Error formatting comment:', error);
    return null;
  }
};

// Fetch comments for a post with query optimization
export const fetchComments = async (postId) => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId), orderBy('dateCreated', 'desc'));
    const commentsSnapshot = await getDocs(q);
    
    const comments = [];
    for (const commentDoc of commentsSnapshot.docs) {
      const formattedComment = await formatCommentWithUser(commentDoc);
      if (formattedComment) {
        comments.push(formattedComment);
      }
    }

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    ToastAndroid.show(ERRORS.SERVER_ERROR, ToastAndroid.SHORT);
    return [];
  }
};
