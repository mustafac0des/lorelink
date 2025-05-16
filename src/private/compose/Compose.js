import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Icon } from '@rneui/themed';
import Typical from 'react-native-typical';

const themeColor = '#6200ee';

export default function Compose() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome! I'm your AI writing assistant. How can I help you today?",
      sender: 'bot',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendToGemini = async (prompt) => {
    prompt = prompt + " /END if this typed message is a query about generating/writing a story, generate one, otherwise, generate random poem of 4 lines, depicting that the typed query is not requesting about writing a story and type that lorelink a social platform with AI powered to share and generate stories using Generative AI so ask for one instead. Don't explicitly type anything besides what I have instructed you on.";
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );
  
    const data = await res.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Could not generate response.'
    );
  };  

  const handleSend = async () => {
    if (!draft.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: draft.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setLoading(true);

    try {
      const aiText = await sendToGemini(userMessage.text);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiText,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Failed to get response. Please try again.',
          sender: 'bot',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userAlign : styles.botAlign,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        {item.sender !== 'user' ? (
          <Typical
            steps={[item.text, 1000000]}
            loop={1}
            wrapper="Text"
            style={styles.botText}
          />
          ) : (
            <Text style={styles.userText}>{item.text}</Text>
          )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Message LoreLink AI..."
          value={draft}
          onChangeText={setDraft}
          multiline
          editable={!loading}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!draft.trim() || loading}
          style={styles.sendButton}
        >
          <Icon
            name={loading ? 'hourglass-empty' : 'send'}
            type="material"
            color={draft.trim() ? themeColor : '#ccc'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginVertical: 6,
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
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: themeColor,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#f2f2f2',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
  },
});
