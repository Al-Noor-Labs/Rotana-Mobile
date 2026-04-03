import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SAVED_CARDS = [
  { id: 'c1', type: 'Visa', last4: '4242', expiry: '08/27', holder: 'Rohan Mehta', color: '#1A1F71' },
  { id: 'c2', type: 'Mastercard', last4: '8391', expiry: '03/26', holder: 'Rohan Mehta', color: '#EB001B' },
];

const UPI_APPS = [
  { id: 'u1', app: 'Google Pay', upiId: 'rohan@okaxis', icon: 'google', color: '#4285F4', linked: true },
  { id: 'u2', app: 'PhonePe', upiId: 'rohan@ybl', icon: 'cellphone', color: '#5F259F', linked: true },
  { id: 'u3', app: 'Paytm', upiId: '', icon: 'wallet-outline', color: '#00B9F1', linked: false },
];

const COD = { available: true, label: 'Cash on Delivery', sub: 'Pay when your order arrives' };

interface Props {
  onGoBack: () => void;
}

export default function PaymentMethodsScreen({ onGoBack }: Props) {
  const [defaultCard, setDefaultCard] = useState('c1');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ height: 12 }} />

        {/* Saved Cards */}
        <Text style={styles.sectionLabel}>SAVED CARDS</Text>
        {SAVED_CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, defaultCard === card.id && styles.cardSelected]}
            activeOpacity={0.85}
            onPress={() => setDefaultCard(card.id)}
          >
            <View style={[styles.cardChip, { backgroundColor: card.color }]}>
              <Text style={styles.cardTypeText}>{card.type}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
              <Text style={styles.cardSub}>{card.holder}  ·  Expires {card.expiry}</Text>
            </View>
            <MaterialCommunityIcons
              name={defaultCard === card.id ? 'radiobox-marked' : 'radiobox-blank'}
              size={22}
              color={defaultCard === card.id ? '#0C831F' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addCard} activeOpacity={0.8}>
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#0C831F" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />

        {/* UPI */}
        <Text style={styles.sectionLabel}>UPI</Text>
        {UPI_APPS.map((upi) => (
          <View key={upi.id} style={styles.upiRow}>
            <View style={[styles.upiIcon, { backgroundColor: upi.color + '22' }]}>
              <MaterialCommunityIcons name={upi.icon as any} size={22} color={upi.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.upiApp}>{upi.app}</Text>
              {upi.linked
                ? <Text style={styles.upiId}>{upi.upiId}</Text>
                : <Text style={styles.upiNotLinked}>Not linked</Text>
              }
            </View>
            {upi.linked
              ? <View style={styles.linkedBadge}><Text style={styles.linkedText}>Linked</Text></View>
              : <TouchableOpacity style={styles.linkBtn} activeOpacity={0.8}><Text style={styles.linkBtnText}>Link</Text></TouchableOpacity>
            }
          </View>
        ))}

        <View style={{ height: 16 }} />

        {/* COD */}
        <Text style={styles.sectionLabel}>OTHER</Text>
        <View style={styles.codRow}>
          <MaterialCommunityIcons name="cash-multiple" size={24} color="#0C831F" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.codLabel}>{COD.label}</Text>
            <Text style={styles.codSub}>{COD.sub}</Text>
          </View>
          <MaterialCommunityIcons name="check-circle" size={22} color="#0C831F" />
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
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#888',
    paddingHorizontal: 16, paddingBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8,
    borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  cardSelected: { borderColor: '#0C831F' },
  cardChip: { width: 48, height: 34, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  cardTypeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  cardInfo: { flex: 1, marginLeft: 14 },
  cardNumber: { fontSize: 14, fontWeight: '700', color: '#111' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  addCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: '#0C831F', borderStyle: 'dashed', gap: 8,
  },
  addCardText: { color: '#0C831F', fontSize: 13, fontWeight: '700' },
  upiRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8,
    borderRadius: 14, padding: 14,
    elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  upiIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  upiApp: { fontSize: 14, fontWeight: '700', color: '#111' },
  upiId: { fontSize: 12, color: '#888', marginTop: 2 },
  upiNotLinked: { fontSize: 12, color: '#D32F2F', marginTop: 2 },
  linkedBadge: { backgroundColor: '#E8F5E9', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  linkedText: { color: '#0C831F', fontSize: 12, fontWeight: '700' },
  linkBtn: { borderWidth: 1.5, borderColor: '#0C831F', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 5 },
  linkBtnText: { color: '#0C831F', fontSize: 12, fontWeight: '700' },
  codRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 12,
    borderRadius: 14, padding: 16,
    elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  codLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  codSub: { fontSize: 12, color: '#888', marginTop: 2 },
});
