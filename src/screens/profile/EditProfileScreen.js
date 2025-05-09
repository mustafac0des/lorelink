import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Input, Button, Avatar, Icon } from '@rneui/themed';

export default function EditProfileScreen({ navigation }) {
  const [userName, setUserName] = useState('John Doe');
  const [bio, setBio] = useState('Writer | Story Enthusiast');
  const [email, setEmail] = useState('john.doe@example.com');

  const handleSave = () => {
    // Save profile changes
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Avatar
          size={100}
          rounded
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
        >
          <Avatar.Accessory
            size={30}
            IconComponent={() => (
              <Icon name="camera" type="material-community" color="white" size={20} />
            )}
          />
        </Avatar>
      </View>

      <Input
        label="Username"
        value={userName}
        onChangeText={setUserName}
        leftIcon={{ type: 'material-community', name: 'account', color: '#666' }}
      />

      <Input
        label="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        leftIcon={{ type: 'material-community', name: 'text', color: '#666' }}
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={{ type: 'material-community', name: 'email', color: '#666' }}
      />

      <Button
        title="Save Changes"
        onPress={handleSave}
        color="#6200ee"
        radius={8}
        size="lg"
        containerStyle={{ marginTop: 16 }}
      />
    </View>
  );
}