import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FAQS = [
  {
    q: 'How fast is delivery?',
    a: 'We deliver most orders within 10–20 minutes depending on your location and store availability.',
  },
  {
    q: 'What if my item is out of stock?',
    a: 'If an item goes out of stock after you place your order, we\'ll remove it from your order and adjust the total automatically.',
  },
  {
    q: 'How do I track my order?',
    a: 'You can track your order in real-time from the My Orders section under your profile.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'You can cancel your order within 1 minute of placing it. After that, the order is already being picked and packed.',
  },
  {
    q: 'What is the return policy?',
    a: 'For damaged or wrong items, contact support within 24 hours and we\'ll process an instant refund or replacement.',
  },
  {
    q: 'Are there any delivery charges?',
    a: 'Delivery is free for orders above ₹199. A small platform fee of ₹5 may apply for smaller orders.',
  },
];

const CONTACTS = [
  { icon: 'chat-outline', label: 'Chat with Us', sub: 'Usually replies in 2 mins', color: '#0C831F' },
  { icon: 'phone-outline', label: 'Call Support', sub: '1800-123-4567 (Toll free)', color: '#1565C0' },
  { icon: 'email-outline', label: 'Email Us', sub: 'support@rotanastore.com', color: '#6A1B9A' },
];

interface Props {
  onGoBack: () => void;
}

export default function HelpSupportScreen({ onGoBack }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Contact options */}
        <View style={{ height: 16 }} />
        <Text style={styles.sectionLabel}>CONTACT US</Text>
        {CONTACTS.map((c) => (
          <TouchableOpacity key={c.label} style={styles.contactCard} activeOpacity={0.8}>
            <View style={[styles.contactIcon, { backgroundColor: c.color + '18' }]}>
              <MaterialCommunityIcons name={c.icon as any} size={22} color={c.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactSub}>{c.sub}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 16 }} />

        {/* FAQ */}
        <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
        {FAQS.map((faq, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.faqCard}
            activeOpacity={0.85}
            onPress={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <View style={styles.faqTop}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <MaterialCommunityIcons
                name={openIdx === idx ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#888"
              />
            </View>
            {openIdx === idx && (
              <Text style={styles.faqA}>{faq.a}</Text>
            )}
          </TouchableOpacity>
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
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#888',
    paddingHorizontal: 16, paddingBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  contactCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8,
    borderRadius: 14, padding: 16,
    elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  contactIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  contactSub: { fontSize: 12, color: '#888', marginTop: 2 },
  faqCard: {
    backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8,
    borderRadius: 14, padding: 16,
    elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  faqTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  faqQ: { fontSize: 14, fontWeight: '700', color: '#111', flex: 1, marginRight: 8 },
  faqA: { fontSize: 13, color: '#555', lineHeight: 21, marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
});
