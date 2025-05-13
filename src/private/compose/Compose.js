import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Input, Switch, Icon } from '@rneui/themed';
import { createPost } from '../../functions/postService'; // Import the createPost function

const themeColor = '#6200ee';

export default function Compose() {
  const [mode, setMode] = useState('human');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to chat!', sender: 'bot', mode: 'ai' },
  ]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () => messages.filter(m => m.mode === mode),
    [messages, mode]
  );

  const handlePostMessage = async (msgId) => {
    const message = messages.find(msg => msg.id === msgId);
    
    if (message) {
      // Create post in Firebase
      await createPost({
        postText: message.text,
        isGenerated: mode === 'ai', // If it's AI-generated, set isGenerated to true
        isEdited: editingId === msgId, // Check if the message is being edited
      });
      
      // You can also add any logic to update the messages or UI if needed.
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text>Human</Text>
        <Switch
          value={mode === 'ai'}
          onValueChange={() => {
            setMode(m => m === 'human' ? 'ai' : 'human');
            setDraft('');
            setEditingId(null);
          }}
          color={themeColor}
        />
        <Text>AI</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        {filtered.map(msg => (
          <View key={msg.id} style={{
            marginVertical: 8,
            maxWidth: '75%',
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <View style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: msg.sender === 'user' ? themeColor : '#fff',
            }}>
              <Text style={{ color: msg.sender === 'user' ? '#fff' : '#000' }}>{msg.text}</Text>
            </View>
            {((mode === 'human' && msg.sender === 'user') || (mode === 'ai' && msg.sender === 'bot')) && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                <Icon name='edit' type='material' color={themeColor} onPress={() => handleEdit(msg, setDraft, setEditingId)} />
                <Icon name='send' type='material' color={themeColor} onPress={() => handlePostMessage(msg.id)} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' }}>
        <Input
          placeholder={mode === 'human' ? 'Type message...' : 'Type prompt...'}
          value={draft}
          onChangeText={setDraft}
          inputContainerStyle={{
            borderBottomWidth: 0,
            backgroundColor: '#fff',
            borderRadius: 24,
            paddingHorizontal: 12,
            flex: 1,
            marginRight: 8,
          }}
          rightIcon={
            editingId
              ? <Icon name='save' type='material' color='#fff' onPress={() => handleUpdate({ draft, editingId, setDraft, setEditingId })} />
              : <Icon name={loading ? 'hourglass-empty' : 'north'} type='material' color={themeColor} onPress={() => handleSend({ draft, mode, setMessages, setDraft, setEditingId, setLoading })} />
          }
        />
      </View>
    </View>
  );
}
