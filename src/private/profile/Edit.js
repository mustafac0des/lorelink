import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import { Text, Button, Input, Avatar } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const auth = getAuth();

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        if (!currentUser) {
          ToastAndroid.show('User not authenticated', ToastAndroid.SHORT);
          navigation.goBack();
          return;
        }
        
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name !== 'null' ? userData.name : '');
          setBio(userData.biography || '');
          setProfileImage(userData.picture !== 'null' ? userData.picture : null);
        }
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const imageBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setProfileImage({ uri: imageUri, base64: imageBase64 });
      }
    } catch (error) {
      ToastAndroid.show('Error selecting image', ToastAndroid.SHORT);
    }
  };
  
  const updateProfile = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        ToastAndroid.show('User not authenticated', ToastAndroid.SHORT);
        return;
      }
      
      let imageData = 'null';
      
      if (profileImage) {
        if (typeof profileImage === 'object' && profileImage.base64) {
          imageData = profileImage.base64;
        } 
        else if (typeof profileImage === 'string') {
          imageData = profileImage;
        }
      }
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        name: name || 'null',
        biography: bio,
        picture: imageData
      });
      
      ToastAndroid.show('Profile updated successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      ToastAndroid.show('Error updating profile: ' + error.message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserPassword = async () => {
    setPasswordError('');
    
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      ToastAndroid.show('Password updated successfully', ToastAndroid.SHORT);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !profileImage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>      
      <View style={styles.imageContainer}>
        <Avatar
          size={100}
          rounded
          source={{
            uri: profileImage
              ? (typeof profileImage === 'object' ? profileImage.uri : profileImage)
              : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
          }}
          containerStyle={styles.avatar}
        />
        <Button
          title="Change Photo"
          type="clear"
          onPress={pickImage}
          titleStyle={styles.changePhotoText}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <Input
          label="Display Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          containerStyle={styles.inputContainer}
        />
        
        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={3}
          containerStyle={styles.inputContainer}
        />
        
        <Button
          title="Save Profile Changes"
          onPress={updateProfile}
          buttonStyle={styles.saveButton}
          loading={loading}
          disabled={loading}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        
        <Input
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="Enter current password"
          containerStyle={styles.inputContainer}
        />
        
        <Input
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Enter new password"
          containerStyle={styles.inputContainer}
        />
        
        <Input
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm new password"
          containerStyle={styles.inputContainer}
          errorMessage={passwordError}
        />
        
        <Button
          title="Update Password"
          onPress={updateUserPassword}
          buttonStyle={styles.passwordButton}
          loading={loading}
          disabled={loading || !currentPassword || !newPassword || !confirmPassword}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>Delete Account</Text>
        <Text style={styles.warningText}>This action cannot be undone. All your data will be permanently deleted.</Text>
        
        <Input
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="Enter your password to confirm"
          containerStyle={styles.inputContainer}
          errorMessage={passwordError}
        />
        
        <Button
          title="Delete Account"
          onPress={async () => {
            try {
              if (!currentPassword) {
                setPasswordError('Password is required to delete account');
                return;
              }
              
              setLoading(true);
              const currentUser = auth.currentUser;
              const credential = EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
              );
              
              await reauthenticateWithCredential(currentUser, credential);
              await deleteDoc(doc(db, 'users', currentUser.uid));
              await deleteUser(currentUser);
              
              ToastAndroid.show('Account deleted successfully', ToastAndroid.SHORT);
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
            } catch (error) {
              if (error.code === 'auth/wrong-password') {
                setPasswordError('Password is incorrect');
              } else {
                ToastAndroid.show('Error deleting account: ' + error.message, ToastAndroid.SHORT);
              }
            } finally {
              setLoading(false);
            }
          }}
          buttonStyle={styles.deleteButton}
          titleStyle={styles.deleteButtonText}
          loading={loading}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  changePhotoText: {
    color: '#6200ee',
  },
  section: {
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    marginTop: 10,
  },
  passwordButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
  },
  warningText: {
    color: '#d32f2f',
    marginBottom: 15,
    fontSize: 14,
  },
});