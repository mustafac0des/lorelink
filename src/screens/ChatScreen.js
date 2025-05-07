import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Input, Icon, Button, Switch } from '@rneui/themed';

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
    <View style={{ flex: 1, padding: 16, backgroundColor: '#ffffff' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Text>Write Mode</Text>
        <Switch
          value={isPromptMode}
          onValueChange={() => setIsPromptMode(!isPromptMode)}
          color="#6200ee"
        />
        <Text>Prompt Mode</Text>
      </View>

      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              padding: 12,
              borderRadius: 12,
              marginBottom: 8,
              maxWidth: '75%',
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'user' ? '#6200ee' : '#f1f1f1',
            }}
          >
            <Text style={{ color: message.sender === 'user' ? 'white' : 'black' }}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {isPromptMode ? (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
            Select a prompt:
          </Text>
          {prewrittenPrompts.map((prompt, index) => (
            <Button
              key={index}
              type={selectedPrompt === prompt ? 'solid' : 'outline'}
              onPress={() => setSelectedPrompt(prompt)}
              title={prompt}
              buttonStyle={{ borderColor: '#6200ee', backgroundColor: selectedPrompt === prompt ? '#6200ee' : 'transparent' }}
              containerStyle={{ marginBottom: 8 }}
            />
          ))}

          <Input
            placeholder="Or type your own prompt..."
            value={input}
            onChangeText={setInput}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Input
            placeholder="Write your story..."
            value={input}
            onChangeText={setInput}
            containerStyle={{ flex: 1, marginBottom: 0 }}
            multiline
          />
        </View>
      )}

      <Button
        icon={
          <Icon
            name="send"
            type="material-community"
            color="white"
            size={24}
          />
        }
        onPress={handleSend}
        buttonStyle={{ backgroundColor: '#6200ee', borderRadius: 30, width: 60, height: 60 }}
        containerStyle={{ position: 'absolute', bottom: 16, right: 16 }}
      />
    </View>
  );
}