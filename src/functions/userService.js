import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

import { ToastAndroid } from "react-native";

export const handleSignUp = async (email, password, confirmPassword) => {
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
      
      const data = () => {
        return {
          username: email.split('@')[0],
          email: email,
          biography: "Hey There, I am using Lorelink!",
          followers: [],
          followings: [],
          name: "null",
          picture: "null"
        };
      };

      await setDoc(doc(db, 'users', auth.currentUser.uid), data());
      ToastAndroid.show('Signed up successfully!', ToastAndroid.SHORT);
      console.log("UID:", auth.currentUser.uid);
      navigation.navigate('SignIn');
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
    await signInWithEmailAndPassword(auth, email, password);
    ToastAndroid.show('Signed in successfully!', ToastAndroid.SHORT);
  } catch (err) {
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};