import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText, IconButton } from 'react-native-paper';

export default function SignInScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoggedIn(true);
  };

  return (
    <Surface style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: 34 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="book" size={64} style={{}} />
          <Text variant="headlineSmall" style={{ marginLeft: 8, fontWeight: 'bold' }}>
            Lorelink
          </Text>
        </View>
        <Text variant="bodyMedium" style={{ color: '#6b6b6b', marginTop: 4 }}>
          Sign In to continue to Lorelink
        </Text>
      </View>

      <HelperText type="error" visible={!!error}>
          {error}
      </HelperText>

      <View style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{ marginBottom: 0 }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        

        <Button mode="contained" onPress={handleSignIn} style={{ height: 56, justifyContent: 'center', borderRadius: 0}}>
          Sign In
        </Button>
      </View>
      <Button
          mode="text"
          onPress={() => navigation.navigate('SignUp')}
          style={{ marginTop: 8 }}
        >
          Don't have an account? Sign Up
        </Button>
    </Surface>
  );
}