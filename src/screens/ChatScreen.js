import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, IconButton, Surface, Switch, Button, RadioButton } from 'react-native-paper';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isPromptMode, setIsPromptMode] = useState(false); 
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [prewrittenPrompts] = useState([
    'Write a story about a brave knight.',
    'Describe a futuristic city.',
    'Create a poem about nature.',
  ]);

  const handleSend = () => {
    if (input.trim() === '' && !selectedPrompt) return;

    const userMessage = {
      id: messages.length + 1,
      text: isPromptMode ? selectedPrompt || input : input,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Here is your AI-generated response based on your input.',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);

    setInput('');
    setSelectedPrompt('');
  };

  return (
    <Surface style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Text variant="bodyMedium" style={{ marginRight: 8 }}>
          Write Mode
        </Text>
        <Switch value={isPromptMode} onValueChange={() => setIsPromptMode(!isPromptMode)} />
        <Text variant="bodyMedium" style={{ marginLeft: 8 }}>
          Prompt Mode
        </Text>
      </View>

      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'user' ? '#6200ee' : '#f1f1f1',
              padding: 12,
              borderRadius: 12,
              marginBottom: 8,
              maxWidth: '75%',
            }}
          >
            <Text
              style={{
                color: message.sender === 'user' ? 'white' : 'black',
                fontSize: 14,
              }}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {isPromptMode ? (
        <View>
          <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
            Select a prompt:
          </Text>
          {prewrittenPrompts.map((prompt, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton
                value={prompt}
                status={selectedPrompt === prompt ? 'checked' : 'unchecked'}
                onPress={() => setSelectedPrompt(prompt)}
              />
              <Text variant="bodyMedium">{prompt}</Text>
            </View>
          ))}

          <TextInput
            mode="outlined"
            placeholder="Or type your own prompt..."
            value={input}
            onChangeText={setInput}
            style={{ marginBottom: 8 }}
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            mode="outlined"
            placeholder="Write your story..."
            value={input}
            onChangeText={setInput}
            style={{ flex: 1, marginRight: 8 }}
          />
        </View>
      )}

      <IconButton
        icon="send"
        size={24}
        onPress={handleSend}
        style={{ backgroundColor: '#6200ee', alignSelf: 'flex-end' }}
        iconColor="white"
      />
    </Surface>
  );
}