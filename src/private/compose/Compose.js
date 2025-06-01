import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Icon } from '@rneui/themed';
import Typical from 'react-native-typical';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase.config';

const themeColor = '#6200ee';

export default function Compose() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeChats = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const chatRef = collection(db, 'users', user.uid, 'chats');
        unsubscribeChats = onSnapshot(chatRef, (snapshot) => {
          const fetchedMessages = snapshot.docs.map(doc => doc.data());
          fetchedMessages.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(fetchedMessages);
        });
      } else {
        unsubscribeChats();
        setMessages([]);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeChats();
    };
  }, []);

  const sendToGemini = async (prompt) => {
    try {
      prompt = prompt + " /END if this typed message is a query about generating/writing a story, generate one, otherwise, generate random poem of 4 lines, depicting that the typed query is not requesting about writing a story and type that lorelink a social platform with AI powered to share and generate stories using Generative AI so ask for one instead. Don't explicitly type anything besides what I have instructed you on.";

      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDDzzVVEnKmBBQ93Md0on4fmgZQLiPn9m0',
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

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error in sendToGemini:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  };

  const handleSend = async () => {
    if (!draft.trim()) return;

    const timestamp = Date.now();
    const messageId = `msg_${timestamp}`;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const userMessage = {
        id: messageId,
        text: draft.trim(),
        sender: 'user',
        timestamp,
      };

      const userRef = doc(collection(db, 'users', user.uid, 'chats'));
      await setDoc(userRef, userMessage);
      setDraft('');
      setLoading(true);

      const aiText = await sendToGemini(userMessage.text);

      const aiMessage = {
        id: `msg_${Date.now()}`,
        text: aiText,
        sender: 'bot',
        timestamp: Date.now(),
      };

      const botRef = doc(collection(db, 'users', user.uid, 'chats'));
      await setDoc(botRef, aiMessage);
    } catch (err) {
      console.error('Error in handleSend:', err);
      const auth = getAuth();
      const user = auth.currentUser;

      const errorMessage = {
        id: `msg_${Date.now()}`,
        text: 'Failed to get response. Please try again.',
        sender: 'bot',
        timestamp: Date.now(),
      };

      if (user) {
        const errorRef = doc(collection(db, 'users', user.uid, 'chats'));
        await setDoc(errorRef, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isLastBotMessage = item.sender === 'bot' &&
      messages.filter(m => m.sender === 'bot').slice(-1)[0]?.id === item.id;

    return (
      <View
        style={{
          marginVertical: 6,
          maxWidth: '80%',
          alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            padding: 12,
            borderRadius: 16,
            backgroundColor: item.sender === 'user' ? themeColor : '#f2f2f2',
            borderBottomRightRadius: item.sender === 'user' ? 4 : 16,
            borderBottomLeftRadius: item.sender === 'bot' ? 4 : 16,
          }}
        >
          {item.sender === 'bot' ? (
            isLastBotMessage ? (
              <Typical
                steps={[item.text, 1000000]}
                loop={1}
                wrapper="Text"
                style={{ color: '#000' }}
              />
            ) : (
              <Text style={{ color: '#000' }}>{item.text}</Text>
            )
          ) : (
            <Text style={{ color: '#fff' }}>{item.text}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
      <View
        style={{
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
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#f0f0f0',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 10,
            maxHeight: 100,
          }}
          placeholder="Message LoreLink AI..."
          value={draft}
          onChangeText={setDraft}
          multiline
          editable={!loading}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!draft.trim() || loading}
          style={{ marginLeft: 10 }}
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