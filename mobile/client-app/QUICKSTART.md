# 🚀 Quick Start Guide - Rotana Quick Commerce Mobile App

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app on your mobile device (optional, for testing)

## Step 1: Install Dependencies
```bash
cd "G:\Rotana Quick Commerce\ROTANA-WEB-APP\mobile\client-app"
npm install
```

## Step 2: Start Development Server
```bash
npm start
```

This will start the Expo development server and show a QR code.

## Step 3: Test on Your Device

### Option A: Using Expo Go (Easiest)
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code from the terminal with:
   - **iOS**: Your Camera app
   - **Android**: Expo Go app
3. The app will load on your device

### Option B: Using Emulator/Simulator
```bash
# For Android (requires Android Studio)
npm run android

# For iOS (requires Mac + Xcode)
npm run ios

# For Web Browser
npm run web
```

## 📱 Testing the App Flow

1. **Splash Screen** (3 seconds)
   - You'll see the animated Rotana logo

2. **Login Screen**
   - Enter any phone number (e.g., 501234567)
   - Click "Send OTP"

3. **OTP Verification**
   - Enter test code: **123456**
   - Click "Verify OTP"

4. **Home Screen**
   - You're now logged in!

## 🎨 Screen Navigation Flow

```
Splash (3s) → Login → OTP Verification → Home
                 ↑________________________|
                      (Back button)
```

## 🛠 Development Tips

### Hot Reload
- Press `r` in the terminal to reload the app
- Press `m` to toggle menu
- Shake your device to open developer menu

### Clear Cache (if issues occur)
```bash
npx expo start --clear
```

### Reset Everything
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

## 📦 Key Features Implemented

✅ Splash Screen with animation  
✅ Phone number login interface  
✅ OTP verification with timer  
✅ Modern gradient UI design  
✅ Form validation  
✅ Responsive design  
✅ TypeScript support  

## 🔌 Backend Integration (Next Steps)

To connect with your backend API:

1. **Create environment variables:**
   - Copy `.env.example` to `.env`
   - Add your API endpoint URL

2. **Update API calls:**
   - Modify `LoginScreen.tsx` handleLogin function
   - Modify `OTPVerificationScreen.tsx` handleVerify function

3. **Example API integration:**
   ```typescript
   const handleLogin = async () => {
     const response = await fetch('YOUR_API_URL/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ phoneNumber: `${countryCode}${phoneNumber}` })
     });
     const data = await response.json();
     // Handle response
   };
   ```

## 📱 Test Credentials

- **Phone Number**: Any valid format (e.g., 501234567)
- **OTP Code**: `123456` (hardcoded for testing)

## 🐛 Common Issues

### "Metro bundler won't start"
```bash
npx expo start --clear --dev-client
```

### "Dependencies not found"
```bash
npm install
cd .. && cd client-app
npm start
```

### "App crashes on startup"
- Check that all dependencies are installed
- Ensure you're using Node.js 18+
- Clear metro cache: `npx expo start --clear`

## 📝 Project Structure

```
client-app/
├── src/
│   └── screens/
│       ├── SplashScreen.tsx       # Animated splash screen
│       ├── LoginScreen.tsx        # Phone login
│       ├── OTPVerificationScreen.tsx  # OTP input
│       └── HomeScreen.tsx         # Main app screen
├── App.tsx                        # Main app entry point
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
└── README.md                      # Full documentation
```

## 🎯 Next Steps

1. **Design more screens**: Products, Cart, Checkout
2. **Integrate backend API**: Connect to your server
3. **Add state management**: Redux or Context API
4. **Implement real authentication**: JWT tokens
5. **Add push notifications**: Using Expo Notifications
6. **Setup app icons**: Design proper app icons

## 📞 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review Expo docs: https://docs.expo.dev
- React Native docs: https://reactnative.dev

---

**Happy Coding! 🚀**
