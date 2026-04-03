import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';

interface OTPVerificationScreenProps {
  phoneNumber: string;
  onVerifySuccess: () => void;
  onGoBack: () => void;
}

export default function OTPVerificationScreen({
  phoneNumber,
  onVerifySuccess,
  onGoBack,
}: OTPVerificationScreenProps) {
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer]       = useState(60);
  const [canResend, setResend]  = useState(false);
  const [focusedIdx, setFocused] = useState(0);
  const [errorMsg, setError]    = useState('');

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const cardSlide = useRef(new Animated.Value(36)).current;
  const cardFade  = useRef(new Animated.Value(0)).current;
  const shakeX    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.spring(cardSlide, { toValue: 0, tension: 58, friction: 8, useNativeDriver: true }),
    ]).start();
    setTimeout(() => inputRefs.current[0]?.focus(), 420);

    const iv = startTimer();
    return () => clearInterval(iv);
  }, []);

  function startTimer() {
    return setInterval(() => {
      setTimer((p) => {
        if (p <= 1) { setResend(true); return 0; }
        return p - 1;
      });
    }, 1000);
  }

  const handleChange = (value: string, index: number) => {
    if (value && !/^\d$/.test(value)) return;
    setError('');
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocused(index + 1);
    }
    if (next.every((d) => d !== '') && index === 5) {
      Keyboard.dismiss();
      verify(next.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocused(index - 1);
    }
  };

  const triggerShake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue:  8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue:  6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue:  0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const verify = (code?: string) => {
    const c = code ?? otp.join('');
    if (c.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (c === '123456') {
        onVerifySuccess();
      } else {
        setError('Incorrect code. Please try again.');
        triggerShake();
        setOtp(['', '', '', '', '', '']);
        setFocused(0);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    }, 1200);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setFocused(0);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
    startTimer();
  };

  const allFilled = otp.every((d) => d !== '');

  return (
    <View style={styles.container}>
      {/* â”€â”€ Purple hero â”€â”€ */}
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <View style={styles.heroDotBR} />
        <TouchableOpacity style={styles.backBtn} onPress={onGoBack} activeOpacity={0.75}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroBody}>
          <View style={styles.shieldCircle}>
            <MaterialCommunityIcons name="shield-lock-outline" size={42} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>OTP Verification</Text>
          <Text style={styles.heroSub}>
            Code sent to{' '}
            <Text style={styles.heroPhone}>{phoneNumber}</Text>
          </Text>
        </View>
      </View>

      {/* â”€â”€ White card â”€â”€ */}
      <Animated.View
        style={[styles.card, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}
      >
        <Text style={styles.cardTitle}>Enter 6-digit code</Text>

        {/* OTP boxes */}
        <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeX }] }]}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputRefs.current[i] = r; }}
              style={[
                styles.otpBox,
                digit !== '' && styles.otpBoxFilled,
                focusedIdx === i && styles.otpBoxFocused,
                !!errorMsg  && styles.otpBoxError,
              ]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              onFocus={() => setFocused(i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {/* Error / hint */}
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <Text style={styles.hintText}>Auto-verifies when all 6 digits are entered</Text>
        )}

        {/* Verify button */}
        <TouchableOpacity
          style={[styles.btn, (!allFilled || isLoading) && styles.btnDisabled]}
          onPress={() => verify()}
          disabled={!allFilled || isLoading}
          activeOpacity={0.85}
        >
          <View style={styles.btnInner}>
            <Text style={styles.btnText}>
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Text>
            {!isLoading && <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />}
          </View>
        </TouchableOpacity>

        {/* Resend row */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
              <Text style={styles.resendBtn}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          )}
        </View>

        {/* Test tip */}
        <View style={styles.testHint}>
          <MaterialCommunityIcons name="information-outline" size={13} color="#ccc" />
          <Text style={styles.testText}>
            {'  '}Testing: use code <Text style={styles.testCode}>123456</Text>
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  hero: {
    backgroundColor: PURPLE,
    paddingTop: 56,
    paddingBottom: 52,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', top: -55, right: -55,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroDotBR: {
    position: 'absolute', bottom: -40, left: -40,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 18,
  },
  heroBody: { alignItems: 'center' },
  shieldCircle: {
    width: 82, height: 82, borderRadius: 41,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  heroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.78)', textAlign: 'center' },
  heroPhone: { fontWeight: '700', color: '#fff' },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -22,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  cardTitle: {
    fontSize: 20, fontWeight: '800', color: '#111',
    marginBottom: 24, textAlign: 'center',
  },

  otpRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,
  },
  otpBox: {
    width: 48, height: 56, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    fontSize: 22, fontWeight: '800', textAlign: 'center', color: '#111',
  },
  otpBoxFocused: {
    borderColor: PURPLE, backgroundColor: '#F3EEF9',
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
  },
  otpBoxFilled: {
    borderColor: PURPLE, backgroundColor: '#EDE7F6', color: PURPLE,
  },
  otpBoxError: {
    borderColor: '#E53935', backgroundColor: '#FFF5F5',
  },

  hintText:  { fontSize: 12, color: '#bbb', textAlign: 'center', marginBottom: 22 },
  errorText: { fontSize: 12, color: '#E53935', textAlign: 'center', marginBottom: 22, fontWeight: '600' },

  btn: {
    backgroundColor: PURPLE, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
    marginBottom: 20,
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  btnDisabled: { backgroundColor: '#C5B3E0', shadowOpacity: 0 },
  btnInner:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '800' },

  resendRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  resendLabel: { fontSize: 14, color: '#888' },
  resendBtn:   { fontSize: 14, color: PURPLE, fontWeight: '700' },
  timerText:   { fontSize: 14, color: '#aaa' },

  testHint: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  testText: { fontSize: 12, color: '#ccc' },
  testCode: { fontWeight: '700', color: '#999' },
});
