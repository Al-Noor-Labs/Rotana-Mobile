# Rotana Quick Commerce - Mobile App

A React Native mobile application for quick commerce built with Expo.

## 🚀 Features

- **Splash Screen**: Beautiful animated splash screen with gradient background
- **Phone Authentication**: Login with phone number
- **OTP Verification**: Secure OTP verification screen
- **Modern UI**: Clean, modern design with smooth animations
- **TypeScript**: Fully typed for better development experience

## 📱 Screens

### 1. Splash Screen
- Animated logo entrance
- Gradient background
- Auto-navigates to login after 3 seconds

### 2. Login Screen
- Phone number input with country code
- Form validation
- Alternative email login option
- Terms and privacy policy links

### 3. OTP Verification Screen
- 6-digit OTP input
- Auto-focus on next input
- Resend OTP functionality with timer
- Back navigation

### 4. Home Screen
- Welcome message
- Quick action cards
- Category browsing
- Feature highlights

## 🛠 Installation

1. **Navigate to the mobile app directory:**
   ```bash
   cd "G:\Rotana Quick Commerce\ROTANA-WEB-APP\mobile\client-app"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Expo CLI (if not already installed):**
   ```bash
   npm install -g expo-cli
   ```

## 🏃 Running the App

### Start the development server:
```bash
npm start
```

### Run on specific platform:
```bash
# iOS (requires Mac)
npm run ios

# Android (requires Android Studio)
npm run android

# Web
npm run web
```

## 📦 Dependencies

- **React Native**: 0.83.2
- **Expo**: ~55.0.5
- **React Navigation**: ^7.1.33
- **expo-linear-gradient**: ~14.0.1
- **TypeScript**: ~5.9.2

## 🧪 Testing

For testing the OTP verification, use the following test code:
```
123456
```

## 📁 Project Structure

```
client-app/
├── src/
│   └── screens/
│       ├── SplashScreen.tsx
│       ├── LoginScreen.tsx
│       ├── OTPVerificationScreen.tsx
│       └── HomeScreen.tsx
├── App.tsx
├── package.json
└── README.md
```

## 🎨 Design Features

- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Adapts to different screen sizes

## 🔐 Authentication Flow

1. App starts with Splash Screen
2. User sees Login Screen
3. User enters phone number
4. OTP is sent to phone
5. User enters OTP in Verification Screen
6. Upon successful verification, user is directed to Home Screen

## 🤝 Backend Integration

To integrate with your backend API:

1. Update the `handleLogin` function in `LoginScreen.tsx` to call your login API
2. Update the `handleVerify` function in `OTPVerificationScreen.tsx` to call your OTP verification API
3. Implement proper error handling and loading states

## 📱 Expo Go

To test on your physical device:

1. Install Expo Go app on your phone (available on App Store and Play Store)
2. Run `npm start` in the project directory
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## 🚀 Building for Production

### Android APK:
```bash
expo build:android
```

### iOS IPA:
```bash
expo build:ios
```

### Using EAS Build (Recommended):
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 📝 Notes

- Make sure you have Node.js 18+ installed
- For iOS development, you need a Mac with Xcode
- For Android development, you need Android Studio
- The app currently uses mock authentication - integrate with your backend API

## 🐛 Troubleshooting

### Metro bundler issues:
```bash
npx expo start --clear
```

### Dependency conflicts:
```bash
rm -rf node_modules
npm install
```

### Cache issues:
```bash
npx expo start --clear
```

## 📞 Support

For issues and questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: March 2026
