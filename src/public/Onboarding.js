import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, Icon } from '@rneui/themed';

const onboardingSteps = [
  {
    title: 'Welcome to LoreLink',
    description: 'LoreLink is a platform for writers and readers to connect and share stories',
    icon: 'book-open',
  },
  {
    title: 'AI-Powered Stories',
    description: 'Generate unique stories with the help of AI using your own prompts',
    icon: 'robot',
  },
  {
    title: 'Share Your Tales',
    description: 'Connect with other writers and share your stories with the world',
    icon: 'share',
  },
];

export default function Onboarding({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStep = (count) => async () => {
    const newStep = currentStep + count;
    if (newStep >= 0 && newStep < onboardingSteps.length) {
      setCurrentStep(newStep);
    } else {
      navigation.replace('SignIn');
    }
  };  

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Icon
          name={onboardingSteps[currentStep].icon}
          type="material-community"
          size={120}
          color="#6200ee"
          containerStyle={{ marginBottom: 24 }}
        />
        <Text 
          h3 
          h3Style={{ textAlign: 'center', marginBottom: 8 }}
        >
          {onboardingSteps[currentStep].title}
        </Text>
        <Text
          style={{ textAlign: 'center', marginHorizontal: 24, color: '#666666', fontSize: 16 }}
        >
          {onboardingSteps[currentStep].description}
        </Text>
      </View>

      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: index === currentStep ? '#6200ee' : '#e0e0e0',
              }}
            />
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {currentStep > 0 && (
            <Button
              type="outline"
              onPress={handleStep(-1)}
              icon={{
                name: 'arrow-left',
                type: 'material-community',
                color: '#6200ee',
              }}
              buttonStyle={{ minWidth: 120, borderRadius: 8, borderColor: '#6200ee' }}
              titleStyle={{ color: '#6200ee' }}
              title="Back"
            />
          )}
          <Button
            onPress={handleStep(1)}
            icon={{
              name: 'arrow-right',
              type: 'material-community',
              color: 'white',
            }}
            iconRight
            buttonStyle={{ minWidth: 120, borderRadius: 8, backgroundColor: '#6200ee' }}
            title="Next"
          />
        </View>
      </View>
    </View>
  );
}