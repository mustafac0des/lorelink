import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { ListItem, Switch, Text, Divider, Button } from '@rneui/themed';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [aiAssistant, setAiAssistant] = useState(true);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 16 }}>
        <Text h4 style={{ marginBottom: 16 }}>Preferences</Text>
        
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Push Notifications</ListItem.Title>
            <ListItem.Subtitle>Get notified about new stories and interactions</ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={notifications} onValueChange={setNotifications} color="#6200ee" />
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Dark Mode</ListItem.Title>
            <ListItem.Subtitle>Switch between light and dark themes</ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={darkMode} onValueChange={setDarkMode} color="#6200ee" />
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Email Updates</ListItem.Title>
            <ListItem.Subtitle>Receive weekly digests and updates</ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={emailUpdates} onValueChange={setEmailUpdates} color="#6200ee" />
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>AI Writing Assistant</ListItem.Title>
            <ListItem.Subtitle>Enable AI suggestions while writing</ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={aiAssistant} onValueChange={setAiAssistant} color="#6200ee" />
        </ListItem>

        <Divider style={{ marginVertical: 16 }} />

        <Text h4 style={{ marginBottom: 16 }}>Account</Text>

        <ListItem
          onPress={() => navigation.navigate('EditProfile')}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>Edit Profile</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem
          onPress={() => navigation.navigate('ChangePassword')}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>Change Password</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem
          onPress={() => navigation.navigate('Privacy')}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>Privacy Settings</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Divider style={{ marginVertical: 16 }} />

        <Text h4 style={{ marginBottom: 16 }}>Support</Text>

        <ListItem
          onPress={() => navigation.navigate('Help')}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>Help Center</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem
          onPress={() => navigation.navigate('About')}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>About Lorelink</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Button
          title="Delete Account"
          type="outline"
          color="error"
          onPress={() => navigation.navigate('DeleteAccount')}
          containerStyle={{ marginTop: 32 }}
        />
      </View>
    </ScrollView>
  );
}