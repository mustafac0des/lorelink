import React, { useState } from 'react';
import { View } from 'react-native';
import { 
  Button, 
  Text, 
  Surface, 
  useTheme,
  Avatar,
} from 'react-native-paper';

const onboardingSteps = [
  {
    title: 'Welcome to LoreLink',
    description: 'LoreLink is a platform for writers and readers to connect and share stories',
    icon: 'book-open-variant',
  },
  {
    title: 'AI-Powered Stories',
    description: 'Generate unique stories with the help of AI using your own prompts',
    icon: 'robot',
  },
  {
    title: 'Share Your Tales',
    description: 'Connect with other writers and share your stories with the world',
    icon: 'share-variant',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const theme = useTheme();

  const handleStep = (count) => {
    return () => {
      const newStep = currentStep + count;
      if (newStep >= 0 && newStep < onboardingSteps.length) {
        setCurrentStep(newStep);
      } else {
        navigation.navigate('SignIn');
      }
    };
  };

  return (
    <Surface style={{ flex: 1 }}>
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 24
      }}>
        <Avatar.Icon 
          size={120}
          icon={onboardingSteps[currentStep].icon}
          style={{ marginBottom: 24 }}
          color={theme.colors.primary}
          backgroundColor={theme.colors.primaryContainer}
        />
        <Text 
          variant="headlineMedium" 
          style={{ 
            textAlign: 'center', 
            marginBottom: 8,
            color: theme.colors.onSurface 
          }}
        >
          {onboardingSteps[currentStep].title}
        </Text>
        <Text 
          variant="bodyMedium" 
          style={{ 
            textAlign: 'center', 
            marginHorizontal: 24,
            color: theme.colors.onSurfaceVariant
          }}
        >
          {onboardingSteps[currentStep].description}
        </Text>
      </View>

      <View style={{ padding: 24 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginBottom: 24
        }}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: index === currentStep 
                  ? theme.colors.primary 
                  : theme.colors.surfaceVariant,
              }}
            />
          ))}
        </View>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-evenly',
        }}>
          {currentStep > 0 && (
            <Button
              mode="outlined"
              onPress={handleStep(-1)}
              icon="arrow-left"
              style={{ marginRight: 8 }}
            >
              Back
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleStep(+1)}
            icon="arrow-right"
            contentStyle={{ flexDirection: 'row-reverse' }}
            style={{ marginLeft: 8 }}
          >
            Next
          </Button>
        </View>
      </View>
    </Surface>
  );
}