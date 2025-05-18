import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

import { ToastAndroid } from "react-native";

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

    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);

      const data = {
        username: email.split('@')[0],
        email,
        biography: 'Hey There, I am new to Lorelink!',
        name: 'new user',
        picture: 'null',
        gender: selectedGender,
      };

      await setDoc(doc(db, 'users', auth.currentUser.uid), data);
      await signOut(auth);
    }

    ToastAndroid.show('Signed up successfully! Verify your email to continue.', ToastAndroid.LONG);
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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


export const getProfile = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
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