import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';

interface AuthChoiceScreenProps {
  onNavigateTo: (screen: string) => void;
}

export default function AuthChoiceScreen({ onNavigateTo }: AuthChoiceScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="shopping" size={60} color={PURPLE} />
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.heading}>Rotana Store</Text>
        <Text style={styles.subheading}>Fast · Fresh · Delivered</Text>

        <View style={styles.divider} />

        <Text style={styles.welcomeText}>Welcome to Rotana</Text>
        <Text style={styles.descriptionText}>
          Order groceries, get them delivered in minutes
        </Text>

        <View style={styles.buttonContainer}>
          {/* Sign In Button */}
          <Pressable
            style={styles.primaryButton}
            onPress={() => onNavigateTo('login')}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
          >
            <MaterialCommunityIcons
              name="login"
              size={18}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          {/* Create Account Button */}
          <Pressable
            style={styles.secondaryButton}
            onPress={() => onNavigateTo('register')}
            android_ripple={{ color: 'rgba(91, 45, 142, 0.1)' }}
          >
            <MaterialCommunityIcons
              name="plus-circle"
              size={18}
              color={PURPLE}
              style={styles.buttonIcon}
            />
            <Text style={styles.secondaryButtonText}>Create an Account</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    backgroundColor: PURPLE,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ebebeb',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonIcon: {
    marginRight: 2,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: '700',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ebebeb',
  },
  orText: {
    color: '#999',
    fontSize: 12,
    marginHorizontal: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  footerLink: {
    color: PURPLE,
    fontWeight: '600',
  },
});
