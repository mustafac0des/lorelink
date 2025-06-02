// src/services/userService.js

// =======================
// Imports
// =======================
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  signOut, 
  updatePassword, 
  deleteUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { ToastAndroid } from 'react-native';


// =======================
// Dummy Data (for testing)
// =======================
export const DUMMY_USERS = [
  {
    uid: 'user1',
    username: 'sarah123',
    name: 'Sarah Johnson',
    picture: 'https://randomuser.me/api/portraits/women/1.jpg',
    isFollowed: false,
    biography: 'A bibliophile and aspiring novelist weaving tales of love and adventure.',
  },
  {
    uid: 'user2',
    username: 'michael13',
    name: 'Michael Chen',
    picture: 'https://randomuser.me/api/portraits/men/2.jpg',
    isFollowed: true,
    biography: 'Editor and writer crafting compelling narratives and reviewing contemporary literature.',
  },
  {
    uid: 'user3',
    username: 'wilsonemma',
    name: 'Emma Wilson',
    picture: 'https://randomuser.me/api/portraits/women/3.jpg',
    isFollowed: false,
    biography: 'Storyteller through photography and prose, capturing worlds both real and imagined.',
  },
  {
    uid: 'user4',
    username: 'jr1',
    name: 'James Rodriguez',
    picture: 'https://randomuser.me/api/portraits/men/4.jpg',
    isFollowed: true,
    biography: 'Game developer by trade, fantasy novelist by night, creating immersive sagas.',
  },
  {
    uid: 'user5',
    username: 'sopheeee',
    name: 'Sophia Lee',
    picture: 'https://randomuser.me/api/portraits/women/5.jpg',
    isFollowed: false,
    biography: "Children's book author and illustrator inspiring young minds through whimsical stories.",
  },
];

export const DUMMY_POSTS = [
  {
    pid: 'post1',
    uid: 'user1',
    postText: `Last night I immersed myself in...`,
    datePosted: new Date(Date.now() - 3600000).toLocaleString(),
    likes: { user2: true, user3: true, user4: true },
    comments: [
      {
        uid: 'user2',
        text: 'Elara’s journey sounds captivating!',
        dateCommented: new Date(Date.now() - 10_100_000).toLocaleString(),
      },
      {
        uid: 'user4',
        text: 'The imagery of the runes...',
        dateCommented: new Date(Date.now() - 10_200_001).toLocaleString(),
      },
    ],
  },
  {
    pid: 'post2',
    uid: 'user2',
    postText: `Tonight I reopened a vintage mystery novel...`,
    datePosted: new Date(Date.now() - 7_200_000).toLocaleString(),
    likes: { user1: true, user5: true },
    comments: [
      {
        uid: 'user5',
        text: 'This setup gives me chills!',
        dateCommented: new Date(Date.now() - 10_800_000).toLocaleString(),
      },
    ],
  },
  {
    pid: 'post3',
    uid: 'user3',
    postText: `I’m thrilled to announce the launch of...`,
    datePosted: new Date(Date.now() - 10_800_000).toLocaleString(),
    likes: { user1: true, user2: true, user4: true, user5: true },
    comments: [
      {
        uid: 'user1',
        text: 'Incredible work!',
        dateCommented: new Date(Date.now() - 11_100_000).toLocaleString(),
      },
      {
        uid: 'user4',
        text: 'StorySphere sounds groundbreaking...',
        dateCommented: new Date(Date.now() - 10_700_000).toLocaleString(),
      },
      {
        uid: 'user2',
        text: 'Already downloading!',
        dateCommented: new Date(Date.now() - 10_900_000).toLocaleString(),
      },
    ],
  },
  {
    pid: 'post4',
    uid: 'user4',
    postText: `In my latest design experiment...`,
    datePosted: new Date(Date.now() - 14_400_000).toLocaleString(),
    likes: { user3: true, user5: true },
    comments: [
      {
        uid: 'user5',
        text: 'Integration of ballads sounds unique!',
        dateCommented: new Date(Date.now() - 10_500_000).toLocaleString(),
      },
    ],
  },
  {
    pid: 'post5',
    uid: 'user5',
    postText: `I’m overjoyed to share that I’ve completed...`,
    datePosted: new Date(Date.now() - 18_000_000).toLocaleString(),
    likes: { user1: true, user2: true, user3: true, user4: true },
    comments: [
      {
        uid: 'user1',
        text: 'Luna’s adventure sounds enchanting!',
        dateCommented: new Date(Date.now() - 9_900_000).toLocaleString(),
      },
      {
        uid: 'user3',
        text: 'The verses sound so soothing...',
        dateCommented: new Date(Date.now() - 10_300_000).toLocaleString(),
      },
    ],
  },
];


// =======================
// Authentication Functions
// =======================
export const handleSignUp = async (email, password, confirmPassword, selectedGender) => {
  if (!email || !password || !confirmPassword) {
    ToastAndroid.show('Fill in all fields!', ToastAndroid.SHORT);
    return;
  }
  if (password !== confirmPassword) {
    ToastAndroid.show('Passwords do not match!', ToastAndroid.SHORT);
    return;
  }

  ToastAndroid.show('Signing up...', ToastAndroid.SHORT);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = auth.currentUser;
    if (currentUser) {
      await sendEmailVerification(currentUser);
      const data = {
        username: email.split('@')[0],
        email,
        biography: 'Hey There, I am new to Lorelink!',
        name: 'new user',
        picture: 'null',
        gender: selectedGender,
      };
      await setDoc(doc(db, 'users', currentUser.uid), data);
      await signOut(auth);
    }
    ToastAndroid.show('Signed up successfully! Verify your email to continue.', ToastAndroid.LONG);
    return true;
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const handleSignIn = async (email, password) => {
  if (!email || !password) {
    ToastAndroid.show('Please fill in all fields!', ToastAndroid.SHORT);
    return;
  }

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (!user.emailVerified) {
      ToastAndroid.show('Please verify your email before signing in!', ToastAndroid.LONG);
      await signOut(auth);
      return;
    }
    ToastAndroid.show('Signed in successfully!', ToastAndroid.SHORT);
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    ToastAndroid.show('Signed out successfully!', ToastAndroid.SHORT);
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};


// =======================
// Profile Functions
// =======================
export const checkUserProfile = async () => {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    if (userData?.name === 'new user' || userData?.picture === 'null') {
      ToastAndroid.show('Please complete your profile!', ToastAndroid.LONG);
    }
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const getProfile = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const getUserProfile = (uid) => {
  return DUMMY_USERS.find((user) => user.uid === uid) || null;
};

export const fetchProfileData = async (dummyId, userId, isOwnProfile) => {
  try {
    if (dummyId) {
      return getUserProfile(dummyId);
    }
    const currentUser = auth.currentUser;
    const targetUid = isOwnProfile ? currentUser.uid : userId;
    const userDoc = await getDoc(doc(db, 'users', targetUid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      ToastAndroid.show('Profile not found!', ToastAndroid.SHORT);
    }
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const updateProfile = async (name, bio, profileImage, { navigation }) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      ToastAndroid.show('User not authenticated', ToastAndroid.SHORT);
      return;
    }
    let imageData = 'null';
    if (profileImage) {
      imageData = typeof profileImage === 'object' && profileImage.base64
        ? profileImage.base64
        : profileImage;
    }
    await updateDoc(doc(db, 'users', currentUser.uid), {
      name: name || 'null',
      biography: bio,
      picture: imageData,
    });
    ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
    navigation.goBack();
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const handleUpdatePassword = async (currentPassword, newPassword) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      ToastAndroid.show('No authenticated user found!', ToastAndroid.SHORT);
      return;
    }
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
    ToastAndroid.show('Password updated successfully!', ToastAndroid.SHORT);
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const deleteProfile = async (currentPassword) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      ToastAndroid.show('No authenticated user found!', ToastAndroid.SHORT);
      return;
    }
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await deleteUser(currentUser);
    ToastAndroid.show('Profile deleted successfully!', ToastAndroid.SHORT);
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};


// =======================
// Posts Functions
// =======================
export const loadPosts = () => {
  try {
    return DUMMY_POSTS.map((post) => {
      const userData = DUMMY_USERS.find((u) => u.uid === post.uid) || {};
      return {
        pid: post.pid,
        uid: post.uid,
        postText: post.postText,
        datePosted: post.datePosted,
        likes: post.likes,
        comments: post.comments,
        picture: userData.picture || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        username: userData.username,
        isFollowed: userData.isFollowed,
        likeCount: Object.keys(post.likes || {}).length,
        commentCount: post.comments?.length || 0,
      };
    });
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const getPost = (pid) => {
  const postData = DUMMY_POSTS.find((p) => p.pid === pid);
  if (!postData) return null;

  const enrichedComments = postData.comments.map((c) => {
    const commenter = DUMMY_USERS.find((u) => u.uid === c.uid) || {};
    return {
      id: `${c.uid}_${c.dateCommented || Date.now()}`,
      text: c.text,
      timestamp: c.dateCommented,
      username: commenter.username,
      userPicture: commenter.picture || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
    };
  });

  const author = DUMMY_USERS.find((u) => u.uid === postData.uid) || {};

  return {
    pid: postData.pid,
    uid: postData.uid,
    postText: postData.postText,
    datePosted: postData.datePosted,
    likes: postData.likes,
    comments: enrichedComments,
    likeCount: Object.keys(postData.likes || {}).length,
    commentCount: postData.comments?.length || 0,
    user: {
      username: author.username || 'Unknown',
      picture: author.picture || '',
    },
  };
};

export const getUserPosts = (uid) => {
  if (!uid) throw new Error('User ID not provided');
  const user = getUserProfile(uid);
  return DUMMY_POSTS.filter((p) => p.uid === uid).map((post) => ({
    pid: post.pid,
    postText: post.postText,
    datePosted: post.datePosted,
    likeCount: Object.keys(post.likes || {}).length,
    commentCount: post.comments?.length || 0,
    user: {
      username: user.username,
      picture: user.picture,
    },
  }));
};

export const getUserActivity = (uid) => {
  if (!uid) throw new Error('User ID not provided');
  const user = getUserProfile(uid);
  const comments = [];
  DUMMY_POSTS.forEach((post) => {
    post.comments?.forEach((comment) => {
      if (comment.uid === uid) {
        comments.push({
          pid: post.pid,
          text: comment.text,
          postText: post.postText,
          uid,
          dateCommented: comment.dateCommented,
          userName: user.username,
          userImage: user.picture,
        });
      }
    });
  });
  return comments;
};

export const getUserFollowersStatus = (uid) => {
  const user = DUMMY_USERS.find((u) => u.uid === uid);
  if (!user) return null;
  const followers = DUMMY_USERS.filter((u) => u.isFollowed && u.uid !== uid);
  const following = user.isFollowed ? [user] : [];
  return { followers, following };
};
