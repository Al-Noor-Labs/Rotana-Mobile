import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By downloading, installing, or using the Rotana Store application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service. These terms apply to all users of the app, including browsers, vendors, customers, and contributors of content.',
  },
  {
    title: '2. Use of Service',
    body: 'Rotana Store provides a quick-commerce grocery delivery platform. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others. You must not misuse our platform by introducing viruses, attempting unauthorised access, or placing fraudulent orders.',
  },
  {
    title: '3. Account Registration',
    body: 'To place an order, you must register using a valid mobile number and verify it via OTP. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account.',
  },
  {
    title: '4. Orders and Payments',
    body: 'All orders placed on Rotana Store are subject to availability. Prices are displayed inclusive of applicable taxes. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity. Payment must be completed at the time of order placement.',
  },
  {
    title: '5. Delivery',
    body: 'We aim to deliver orders within 10–20 minutes, subject to location, availability, and demand. Delivery times are estimates and not guaranteed. Rotana Store shall not be held liable for delays caused by circumstances beyond our reasonable control, including traffic, weather, or force majeure events.',
  },
  {
    title: '6. Returns and Refunds',
    body: 'If you receive a damaged, expired, or incorrect item, please contact our support team within 24 hours of delivery. Eligible claims will be processed as a refund to your original payment method or as store credits within 3–5 business days. Opened or consumed products are not eligible for return unless defective.',
  },
  {
    title: '7. Intellectual Property',
    body: 'All content on the Rotana Store platform, including logos, text, graphics, images, and software, is the intellectual property of Rotana Store Pvt. Ltd. and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our written permission.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'To the maximum extent permitted by law, Rotana Store shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app or inability to access the service. Our total liability shall not exceed the amount paid by you for the order in question.',
  },
  {
    title: '9. Governing Law',
    body: 'These Terms and Conditions are governed by the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra.',
  },
  {
    title: '10. Changes to Terms',
    body: 'We reserve the right to update these Terms and Conditions at any time. Significant changes will be communicated through the app or via registered contact details. Continued use of the app after changes are posted constitutes your acceptance of the updated terms.',
  },
  {
    title: '11. Contact Us',
    body: 'For any questions regarding these Terms and Conditions, please contact us at: legal@rotanastore.com or write to: Rotana Store Pvt. Ltd., 5th Floor, Tech Park, Malad East, Mumbai – 400097, Maharashtra, India.',
  },
];

interface Props {
  onGoBack: () => void;
}

export default function TermsConditionsScreen({ onGoBack }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Intro card */}
        <View style={styles.intro}>
          <MaterialCommunityIcons name="file-document-check-outline" size={36} color="#0C831F" />
          <Text style={styles.introTitle}>Our Terms of Use</Text>
          <Text style={styles.introSub}>Last updated: March 1, 2026</Text>
          <Text style={styles.introText}>
            Please read these terms carefully before using Rotana Store.
            By using our app, you agree to these terms and our Privacy Policy.
          </Text>
        </View>

        {SECTIONS.map((sec, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.section}
            activeOpacity={0.85}
            onPress={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <View style={styles.secTop}>
              <Text style={styles.secTitle}>{sec.title}</Text>
              <MaterialCommunityIcons
                name={openIdx === idx ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#888"
              />
            </View>
            {openIdx === idx && (
              <Text style={styles.secBody}>{sec.body}</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <MaterialCommunityIcons name="check-circle-outline" size={20} color="#0C831F" />
          <Text style={styles.footerText}>
            By using Rotana Store, you confirm you have read{'\n'}and agreed to these Terms and Conditions.
          </Text>
        </View>

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
  secTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  secTitle: { fontSize: 14, fontWeight: '800', color: '#111', flex: 1, marginRight: 8 },
  secBody: { fontSize: 13, color: '#555', lineHeight: 22, marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  footerText: { fontSize: 12, color: '#0C831F', lineHeight: 18, flex: 1, fontWeight: '600' },
});
