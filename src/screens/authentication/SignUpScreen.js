import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText, IconButton } from 'react-native-paper';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    console.log('Sign Up:', { email, password, confirmPassword });
    navigation.navigate('SignIn');
  };

  const isEmailValid = email.includes('@');

  return (
      <Surface style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="book" size={64} style={{}} />
            <Text variant="headlineSmall" style={{ marginLeft: 8, fontWeight: 'bold' }}>
              Lorelink
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: '#6b6b6b', marginTop: 4 }}>
            Sign Up to continue to Lorelink
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
          />
  
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            label="Confirm Password"
            value={password}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
  
          <Button mode="contained" onPress={handleSignUp} style={{ height: 56, justifyContent: 'center', borderRadius: 0, marginTop: 1}}>
            Sign Up
          </Button>
        </View>
        <Button
            mode="text"
            onPress={() => navigation.navigate('SignIn')}
            style={{ marginTop: 8 }}
          >
            Don't have an account? Sign In
          </Button>
        <HelperText type="info" style={{ textAlign: 'center'}}>
          By signing in, you agree to Lorelink's Terms of Service and Privacy Policy.
        </HelperText>
      </Surface>
    );
}