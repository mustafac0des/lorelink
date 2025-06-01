import { useState } from 'react';
import { View } from 'react-native';
import { Input, Button, Text, Icon, ButtonGroup } from '@rneui/themed';
import { handleSignUp } from '../backend/Services';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [genderIndex, setGenderIndex] = useState(null);
  const genders = ['male', 'female'];
  const selectedGender = genderIndex !== null ? genders[genderIndex] : 'male';

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <View style={{ alignItems: 'center', marginBottom: 34 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='book' type='material-community' size={64} color='#6200ee' />
          <Text h4 style={{ marginLeft: 8, fontWeight: 'bold' }}>Lorelink</Text>
        </View>
        <Text style={{ color: '#666', marginTop: 4, fontSize: 16 }}>Sign Up to continue to Lorelink</Text>
      </View>
      <View style={{ marginBottom: 16 }}>
        <Input
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          leftIcon={{ type: 'material-community', name: 'email', color: '#666' }}
        />
        <Input
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={{ type: 'material-community', name: 'lock', color: '#666' }}
        />
        <Input
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          leftIcon={{ type: 'material-community', name: 'lock', color: '#666' }}
        />
        <Text style={{ marginLeft: 42, marginBottom: 6, color: '#8c8c8c', fontSize: 18, }}>Select Gender</Text>
        <ButtonGroup
          buttons={genders}
          selectedIndex={genderIndex}
          onPress={setGenderIndex}
          containerStyle={{ marginBottom: 16, borderRadius: 8, borderWidth: 1, borderColor: '#8c8c8c' }}
          selectedButtonStyle={{ backgroundColor: '#6200ee' }}
          selectedTextStyle={{ color: '#fff', fontWeight: 'bold' }}
        />
        <Button
          title='Sign Up'
          onPress={() => {
            let hasSignedUp = handleSignUp(email, password, confirmPassword, selectedGender);
            if (hasSignedUp) {
              setTimeout(() => {
                navigation.navigate('SignIn');
              }, 3000);
            }
          }}
          buttonStyle={{ backgroundColor: '#6200ee', height: 56, borderRadius: 8 }}
          containerStyle={{ marginTop: 16 }}
        />
      </View>
      <Button
        type='clear'
        onPress={() => navigation.navigate('SignIn')}
        titleStyle={{ color: '#6200ee' }}
        title='Already have an account? Sign In'
      />
      <Text style={{ textAlign: 'center', color: '#666666', marginTop: 16, fontSize: 14 }}>
        By signing in, you agree to Lorelink's Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}