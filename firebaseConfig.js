import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA1tcj8fOQTbxceDi-dbJZcXI3YZf37kX8",
    authDomain: "lorelink-767bf.firebaseapp.com",
    projectId: "lorelink-767bf",
    storageBucket: "lorelink-767bf.firebasestorage.app",
    messagingSenderId: "608444039699",
    appId: "1:608444039699:web:e701d920d43d616305b5e6"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

import { getFirestore } from 'firebase/firestore';

const db = getFirestore(app);

export { auth, db };