import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';

interface LoginScreenProps {
  onLoginSuccess: (phoneNumber: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [phone, setPhone]       = useState('');
  const [isLoading, setLoading] = useState(false);
  const [focused, setFocused]   = useState(false);
  const inputScale = useRef(new Animated.Value(1)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.spring(inputScale, { toValue: 1.015, useNativeDriver: true, tension: 80, friction: 5 }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.spring(inputScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }).start();
  };

  const isValid = phone.replace(/\D/g, '').length >= 10;

  const handleSend = () => {
    if (!isValid || isLoading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(phone);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* ── Purple hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroCircle} />
          <View style={styles.heroDotBL} />
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="storefront-outline" size={38} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Rotana Store</Text>
          <Text style={styles.heroSub}>Groceries delivered in minutes</Text>
        </View>

        {/* ── White card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter your phone</Text>
          <Text style={styles.cardSub}>We'll send a one-time verification code</Text>

          {/* Phone input */}
          <Animated.View
            style={[
              styles.inputWrap,
              focused && styles.inputWrapFocused,
              { transform: [{ scale: inputScale }] },
            ]}
          >
            <View style={styles.prefixBox}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.prefix}>+91</Text>
              <View style={styles.prefixDivider} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="98765 43210"
              placeholderTextColor="#bbb"
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/[^\d\s]/g, ''))}
              keyboardType="phone-pad"
              maxLength={14}
              onFocus={onFocus}
              onBlur={onBlur}
              autoFocus
            />
          </Animated.View>

          {/* CTA button */}
          <TouchableOpacity
            style={[styles.btn, !isValid && styles.btnDisabled]}
            onPress={handleSend}
            disabled={!isValid || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <Text style={styles.btnText}>Sending OTP…</Text>
            ) : (
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>Send OTP</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {'  &  '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: PURPLE,
    paddingTop: 72,
    paddingBottom: 54,
    paddingHorizontal: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', top: -55, right: -55,
    width: 190, height: 190, borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroDotBL: {
    position: 'absolute', bottom: -30, left: -30,
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  logoCircle: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 0.3,
  },
  heroSub: {
    fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 6,
  },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -22,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 5 },
  cardSub:   { fontSize: 13, color: '#999', marginBottom: 26 },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  inputWrapFocused: {
    borderColor: PURPLE,
    backgroundColor: '#fff',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  prefixBox: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 15,
    backgroundColor: '#f2f2f2',
    gap: 6,
  },
  flag:          { fontSize: 18 },
  prefix:        { fontSize: 14, fontWeight: '700', color: '#333' },
  prefixDivider: { width: 1, height: 20, backgroundColor: '#ddd', marginLeft: 4 },
  input: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 15,
    fontSize: 16, color: '#111', letterSpacing: 1,
  },

  btn: {
    backgroundColor: PURPLE, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
    marginBottom: 22,
    shadowColor: PURPLE, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32, shadowRadius: 12, elevation: 5,
  },
  btnDisabled: { backgroundColor: '#C5B3E0', shadowOpacity: 0 },
  btnInner:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '800' },

  divider: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 18,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ebebeb' },
  dividerText: { fontSize: 12, color: '#bbb', marginHorizontal: 12 },

  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#e8e8e8',
    borderRadius: 14, paddingVertical: 13,
    marginBottom: 24, backgroundColor: '#fafafa',
    gap: 10,
  },
  socialIcon: {
    fontSize: 17, fontWeight: '800', color: '#4285F4',
    fontStyle: 'italic',
  },
  socialText: { fontSize: 15, color: '#333', fontWeight: '600' },

  terms:     { fontSize: 11, color: '#bbb', textAlign: 'center', lineHeight: 18 },
  termsLink: { color: PURPLE, fontWeight: '600' },
});
