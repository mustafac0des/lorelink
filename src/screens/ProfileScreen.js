import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProfileScreen({ navigation, setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Profile Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});