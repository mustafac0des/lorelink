import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text, Input, Icon } from '@rneui/themed';

const themeColor = '#6200ee';

export default function Compose() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome! I\'m your AI writing assistant. How can I help you today?', sender: 'bot' },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!draft.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: draft.trim(),
      sender: 'user',
    };

    setMessages(prev => [...prev, newMessage]);
    setDraft('');
    setLoading(true);

    try {
      setTimeout(() => {
        const aiResponse = {
          id: Date.now(),
          text: 'This is a simulated AI response. In the future, this will be replaced with actual AI-generated content.',
          sender: 'bot',
        };
        setMessages(prev => [...prev, aiResponse]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scroll}>
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              msg.sender === 'user' ? styles.userAlign : styles.botAlign
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.botBubble
              ]}
            >
              <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputWrapper}>
        <Input
          placeholder="Message LoreLink AI..."
          value={draft}
          onChangeText={setDraft}
          multiline
          inputContainerStyle={styles.inputContainer}
          rightIcon={
            <Icon
              name={loading ? 'hourglass-empty' : 'send'}
              type="material"
              color={draft.trim() ? themeColor : '#ccc'}
              onPress={handleSend}
              disabled={loading || !draft.trim()}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    padding: 16,
  },
  scroll: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userAlign: {
    alignSelf: 'flex-end',
  },
  botAlign: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: themeColor,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  inputWrapper: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
    maxHeight: 100,
  },
});
