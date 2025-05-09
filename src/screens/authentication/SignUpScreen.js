import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, Button, Text, Icon } from '@rneui/themed';

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

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <View style={{ alignItems: 'center', marginBottom: 34 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="book"
            type="material-community"
            size={64}
            color="#6200ee"
          />
          <Text 
            h4 
            style={{ marginLeft: 8, fontWeight: 'bold' }}
          >
            Lorelink
          </Text>
        </View>
        <Text style={{ color: '#6b6b6b', marginTop: 4, fontSize: 16 }}>
          Sign Up to continue to Lorelink
        </Text>
      </View>

      {error ? (
        <Text style={{ color: '#ff3333', marginBottom: 16, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}

      <View style={{ marginBottom: 16 }}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={{ type: 'material-community', name: 'email', color: '#666' }}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={{ type: 'material-community', name: 'lock', color: '#666' }}
        />

        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          leftIcon={{ type: 'material-community', name: 'lock', color: '#666' }}
        />

        <Button
          title="Sign Up"
          onPress={handleSignUp}
          buttonStyle={{ backgroundColor: '#6200ee', height: 56, borderRadius: 8 }}
          containerStyle={{ marginTop: 16 }}
        />
      </View>

      <Button
        type="clear"
        onPress={() => navigation.navigate('SignIn')}
        titleStyle={{ color: '#6200ee' }}
        title="Already have an account? Sign In"
      />

      <Text style={{ textAlign: 'center', color: '#666666', marginTop: 16, fontSize: 14 }}>
        By signing in, you agree to Lorelink's Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}