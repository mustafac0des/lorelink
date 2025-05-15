import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { Avatar, Image } from '@rneui/base';

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

    setTimeout(() => {
      const aiResponse = {
        id: Date.now(),
        text: 'This is a simulated AI response. In the future, this will be replaced with actual AI-generated content.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
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
        {item.sender === 'bot' && (
          <Image
          style={{width: 200, height: 100, borderRadius: 10}}
          source={{uri: 'https://picsum.photos/id/237/200/300'}}
          />
        )}
        <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
          {item.text}1
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id.toString()}
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
