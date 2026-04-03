import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide when you register, place orders, or contact support — including your name, phone number, delivery address, and payment details. We also automatically collect usage data, device information, and location (with your permission) to provide faster delivery.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your information is used to process and deliver your orders, personalise your experience, send order updates and promotional offers (with your consent), improve our app and services, and comply with legal obligations.',
  },
  {
    title: '3. Sharing Your Information',
    body: 'We do not sell your personal data. We share necessary information with delivery partners to fulfil orders, payment processors to handle transactions, and service providers who help us operate our platform — all under strict confidentiality agreements.',
  },
  {
    title: '4. Data Security',
    body: 'We use industry-standard encryption (TLS/SSL) to protect data in transit and secure servers with access controls. Payment information is processed through PCI-DSS compliant gateways and is never stored on our servers.',
  },
  {
    title: '5. Cookies and Tracking',
    body: 'We use cookies and similar technologies to remember your preferences, analyse app usage, and deliver relevant content. You can manage cookie preferences in your device settings, though some features may be affected.',
  },
  {
    title: '6. Your Rights',
    body: 'You have the right to access, correct, or delete your personal data at any time. You may also opt out of marketing communications, request data portability, or withdraw consent where processing is consent-based. Contact us at privacy@rotanastore.com.',
  },
  {
    title: '7. Children\'s Privacy',
    body: 'Our services are not directed at children under 13. We do not knowingly collect personal information from children. If we discover we have collected such information, we will delete it promptly.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via in-app notification or email. Continued use of the app after changes constitutes acceptance of the updated policy.',
  },
  {
    title: '9. Contact Us',
    body: 'If you have any questions about this Privacy Policy or your personal data, please contact our Data Protection Officer at privacy@rotanastore.com or write to: Rotana Store, 5th Floor, Tech Park, Malad East, Mumbai – 400097.',
  },
];

interface Props {
  onGoBack: () => void;
}

export default function PrivacyPolicyScreen({ onGoBack }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <MaterialCommunityIcons name="shield-check-outline" size={36} color="#0C831F" />
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introSub}>Last updated: March 1, 2026</Text>
          <Text style={styles.introText}>
            Rotana Store is committed to protecting your personal information and your right to privacy.
            This policy explains how we collect, use, and protect your data.
          </Text>
        </View>

        {SECTIONS.map((sec) => (
          <View key={sec.title} style={styles.section}>
            <Text style={styles.secTitle}>{sec.title}</Text>
            <Text style={styles.secBody}>{sec.body}</Text>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  backBtn: { marginRight: 12, padding: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  scroll: { flex: 1 },
  intro: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  introTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginTop: 10 },
  introSub: { fontSize: 12, color: '#888', marginTop: 4, marginBottom: 12 },
  introText: { fontSize: 13, color: '#555', lineHeight: 21, textAlign: 'center' },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 14,
    padding: 16,
    elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  secTitle: { fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 8 },
  secBody: { fontSize: 13, color: '#555', lineHeight: 22 },
});
