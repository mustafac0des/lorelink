import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, Card, Icon, FAB } from '@rneui/themed';

const sampleStories = [
  {
    id: '1',
    title: 'The Lost City',
    preview: 'In a world where cities float...',
    date: '2 days ago',
    likes: 156,
    comments: 23,
    isAIGenerated: true,
  },
  {
    id: '2',
    title: 'Moonlight Tales',
    preview: 'Under the silver moonlight...',
    date: '1 week ago',
    likes: 342,
    comments: 45,
    isAIGenerated: false,
  },
];

export default function MyStoriesScreen({ navigation }) {
  const [stories, setStories] = useState(sampleStories);
  const [filter, setFilter] = useState('all'); // all, ai, self

  const renderStory = ({ item }) => (
    <Card containerStyle={{ borderRadius: 8, margin: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text h4>{item.title}</Text>
        <Icon
          name={item.isAIGenerated ? 'robot' : 'pencil'}
          type="material-community"
          color={item.isAIGenerated ? '#6200ee' : '#03dac6'}
        />
      </View>
      
      <Text style={{ marginBottom: 8, color: '#666' }}>{item.preview}</Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>{item.date}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Button
            type="clear"
            icon={{
              name: 'thumb-up-outline',
              type: 'material-community',
              color: '#666',
            }}
            title={item.likes.toString()}
            titleStyle={{ color: '#666' }}
          />
          <Button
            type="clear"
            icon={{
              name: 'comment-outline',
              type: 'material-community',
              color: '#666',
            }}
            title={item.comments.toString()}
            titleStyle={{ color: '#666' }}
          />
        </View>
      </View>
    </Card>
  );

  const filterStories = (type) => {
    setFilter(type);
    if (type === 'all') {
      setStories(sampleStories);
    } else {
      setStories(sampleStories.filter(story => 
        type === 'ai' ? story.isAIGenerated : !story.isAIGenerated
      ));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View 
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0'
        }}
      >
        <Button
          type={filter === 'all' ? 'solid' : 'outline'}
          title="All"
          onPress={() => filterStories('all')}
          color="#6200ee"
          size="sm"
        />
        <Button
          type={filter === 'ai' ? 'solid' : 'outline'}
          title="AI Generated"
          onPress={() => filterStories('ai')}
          color="#6200ee"
          size="sm"
        />
        <Button
          type={filter === 'self' ? 'solid' : 'outline'}
          title="Self Written"
          onPress={() => filterStories('self')}
          color="#6200ee"
          size="sm"
        />
      </View>

      <FlatList
        data={stories}
        renderItem={renderStory}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 8 }}
      />

      <FAB
        icon={{ name: 'plus', type: 'material-community' }}
        color="#6200ee"
        placement="right"
        onPress={() => navigation.navigate('CreateStory')}
      />
    </View>
  );
}