import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import HomeScreen from './src/screens/HomeScreen';

type Screen = 'splash' | 'login' | 'otp' | 'home';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentScreen('otp');
  };

  const handleOtpVerifySuccess = () => {
    // Navigate to home screen or main app
    setCurrentScreen('home');
    console.log('User authenticated successfully!');
  };

  const handleGoBack = () => {
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      case 'otp':
        return (
          <OTPVerificationScreen
            phoneNumber={phoneNumber}
            onVerifySuccess={handleOtpVerifySuccess}
            onGoBack={handleGoBack}
          />
        );
      case 'home':
        return <HomeScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
