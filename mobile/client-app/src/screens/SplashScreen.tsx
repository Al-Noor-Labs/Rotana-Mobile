import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoFade   = useRef(new Animated.Value(0)).current;
  const logoScale  = useRef(new Animated.Value(0.55)).current;
  const tagFade    = useRef(new Animated.Value(0)).current;
  const ringScale  = useRef(new Animated.Value(1)).current;
  const dot1Fade   = useRef(new Animated.Value(0.3)).current;
  const dot2Fade   = useRef(new Animated.Value(0.3)).current;
  const dot3Fade   = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(logoFade,  { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(tagFade, { toValue: 1, duration: 380, useNativeDriver: true }).start();
    });

    // Pulsing outer ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, { toValue: 1.18, duration: 900, useNativeDriver: true }),
        Animated.timing(ringScale, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Loading dots stagger
    const dotLoop = () => {
      Animated.stagger(180, [
        Animated.sequence([
          Animated.timing(dot1Fade, { toValue: 1,   duration: 300, useNativeDriver: true }),
          Animated.timing(dot1Fade, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot2Fade, { toValue: 1,   duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Fade, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot3Fade, { toValue: 1,   duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Fade, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
      ]).start(dotLoop);
    };
    dotLoop();

    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative circles */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomLeft} />

      {/* Logo block */}
      <Animated.View style={[styles.logoWrap, { opacity: logoFade, transform: [{ scale: logoScale }] }]}>
        <Animated.View style={[styles.ring, { transform: [{ scale: ringScale }] }]} />
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="storefront-outline" size={46} color="#fff" />
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View style={{ opacity: logoFade, alignItems: 'center' }}>
        <Text style={styles.appName}>Rotana Store</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: tagFade }]}>
        FAST · FRESH · DELIVERED
      </Animated.Text>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dot1Fade }]} />
        <Animated.View style={[styles.dot, styles.dotCenter, { opacity: dot2Fade }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Fade }]} />
      </View>

      {/* Footer */}
      <Animated.Text style={[styles.footer, { opacity: tagFade }]}>Powered by Rotana</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTopRight: {
    position: 'absolute', top: -70, right: -70,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  circleTopLeft: {
    position: 'absolute', top: 60, left: -90,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circleBottomLeft: {
    position: 'absolute', bottom: -90, left: -50,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  ring: {
    position: 'absolute',
    width: 114, height: 114, borderRadius: 57,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  appName: {
    fontSize: 34, fontWeight: '800', color: '#fff',
    letterSpacing: 0.5, marginBottom: 10,
  },
  tagline: {
    fontSize: 11, color: 'rgba(255,255,255,0.6)',
    letterSpacing: 3.5, marginBottom: 52,
  },
  dotsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    position: 'absolute', bottom: 58,
  },
  dot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotCenter: {
    width: 9, height: 9, borderRadius: 4.5,
    backgroundColor: '#fff',
  },
  footer: {
    position: 'absolute', bottom: 30,
    fontSize: 11, color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
  },
});
