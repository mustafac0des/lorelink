import React, { useState, useEffect } from 'react';
import { View, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import { Text, Button, Input, Avatar } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { fetchProfileData, updateProfile, deleteProfile, handleUpdatePassword } from '../../backend/Services';
import male_avatar from '../../../assets/male_default.jpg';
import female_avatar from '../../../assets/female_default.jpg';

const auth = getAuth();

export default function Edit({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [gender, setGender] = useState('male');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userData = await fetchProfileData(undefined, auth.currentUser.uid, true);
      setName(userData.name);
      setBio(userData.biography);
      setProfileImage(userData.picture);
      setGender(userData.gender);
    } catch {
      ToastAndroid.show('Error loading profile!', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

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
    } catch {
      ToastAndroid.show('Error selecting image!', ToastAndroid.SHORT);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(name, bio, profileImage, { navigation });
      ToastAndroid.show('Profile updated!', ToastAndroid.SHORT);
    } catch {
      ToastAndroid.show('Error updating profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async () => {
    setPasswordError('');
    if (!currentPassword) {
      ToastAndroid.show('Password is required', ToastAndroid.SHORT);
      return;
    }
    if (newPassword !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }
    if (newPassword.length < 6) {
      ToastAndroid.show('Password must be at least 6 characters long', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      await handleUpdatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Password is required to delete account');
      return;
    }
    setLoading(true);
    try {
      await deleteProfile(currentPassword);
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileImage) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10 }}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Avatar
          size={100}
          rounded
          source={
            profileImage && profileImage !== 'null'
              ? typeof profileImage === 'string'
                ? { uri: profileImage }
                : profileImage
              : gender === 'male'
              ? male_avatar
              : female_avatar
          }
          containerStyle={{ borderColor: '#6200ee', borderWidth: 2 }}
        />
        <Button title="Change Photo" type="clear" onPress={pickImage} titleStyle={{ color: '#6200ee' }} />
      </View>
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Profile Information</Text>
        <Input label="Display Name" value={name} onChangeText={setName} placeholder="Enter your name" />
        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={3}
        />
        <Button
          title="Save Profile Changes"
          onPress={handleUpdateProfile}
          loading={loading}
          disabled={loading}
          buttonStyle={{ backgroundColor: '#6200ee', borderRadius: 8, marginTop: 10 }}
        />
      </View>
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Change Password</Text>
        <Input
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="Enter current password"
        />
        <Input
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Enter new password"
        />
        <Input
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm new password"
          errorMessage={passwordError}
        />
        <Button
          title="Update Password"
          onPress={updateUserPassword}
          loading={loading}
          disabled={loading || !currentPassword || !newPassword || !confirmPassword}
          buttonStyle={{ backgroundColor: '#6200ee', borderRadius: 8, marginTop: 10 }}
        />
      </View>
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#d32f2f', marginBottom: 10 }}>Delete Account</Text>
        <Text style={{ color: '#d32f2f', marginBottom: 15 }}>
          This action cannot be undone. All your data will be permanently deleted.
        </Text>
        <Input
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="Enter your password to confirm"
          errorMessage={passwordError}
        />
        <Button
          title="Delete Account"
          onPress={handleDeleteProfile}
          loading={loading}
          disabled={loading}
          buttonStyle={{ backgroundColor: '#d32f2f', borderRadius: 8, marginTop: 10 }}
          titleStyle={{ color: '#fff' }}
        />
      </View>
    </ScrollView>
  );
}