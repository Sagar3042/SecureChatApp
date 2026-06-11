import React from 'react';
import SecureShareScreen from './screens/SecureShareScreen';
import FileReaderScreen from './screens/FileReaderScreen';
import AnonymousChatScreen from './screens/AnonymousChatScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// স্ক্রিনগুলো ইম্পোর্ট করা হচ্ছে
import LoginScreen from './screens/LoginScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProfileSetup" 
          component={ProfileSetupScreen} 
          options={{ title: 'প্রোফাইল সেটআপ' }} 
        />
        <Stack.Screen 
  name="FileReader" 
  component={FileReaderScreen} 
  options={{ title: 'File Reader & Browser' }} 
/>
        <Stack.Screen 
  name="SecureShare" 
  component={SecureShareScreen} 
  options={{ title: 'Secure Share' }} 
/>
<Stack.Screen 
  name="AnonymousChat" 
  component={AnonymousChatScreen} 
  options={{ title: 'Anonymous Inbox' }} 
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
