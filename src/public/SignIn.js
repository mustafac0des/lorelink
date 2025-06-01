import { useState } from 'react';
import { View } from 'react-native';
import { Input, Button, Text, Icon } from '@rneui/themed';
import { handleSignIn } from '../backend/Services';

export default function SignIn ({ navigation }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          Sign In to continue to Lorelink
        </Text>
      </View>

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
        <Button
          title="Sign In"
          onPress={() => handleSignIn(email, password)}
          buttonStyle={{ backgroundColor: '#6200ee', height: 56, borderRadius: 8 }}
          containerStyle={{ marginTop: 16 }}
        />
      </View>
      <Button
        type="clear"
        onPress={() => navigation.navigate('SignUp')}
        titleStyle={{ color: '#6200ee' }}
        title="Don't have an account? Sign Up"
      />
    </View>
  );
}