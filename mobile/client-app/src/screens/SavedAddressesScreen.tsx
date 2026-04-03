import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ADDRESSES = [
  {
    id: 'a1',
    tag: 'Home',
    tagIcon: 'home-variant-outline',
    name: 'Rohan Mehta',
    phone: '+91 98765 43210',
    line1: '1234, 1st Floor, Hi Tech City',
    line2: 'Hyderabad – 500081',
    isDefault: true,
  },
  {
    id: 'a2',
    tag: 'Office',
    tagIcon: 'briefcase-outline',
    name: 'Rohan Mehta',
    phone: '+91 98765 43210',
    line1: '12, Tech Park, Infinity Tower, Floor 5',
    line2: 'Malad East, Mumbai – 400097',
    isDefault: false,
  },
  {
    id: 'a3',
    tag: 'Parents',
    tagIcon: 'heart-outline',
    name: 'Suresh Mehta',
    phone: '+91 91234 56789',
    line1: '7, Shanti Niwas, Old Town Road',
    line2: 'Dadar, Mumbai – 400014',
    isDefault: false,
  },
];

interface Props {
  onGoBack: () => void;
}

export default function SavedAddressesScreen({ onGoBack }: Props) {
  const [addresses, setAddresses] = useState(ADDRESSES);

  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ height: 12 }} />
        {addresses.map((addr) => (
          <View key={addr.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.tagRow}>
                <MaterialCommunityIcons name={addr.tagIcon as any} size={16} color="#0C831F" />
                <Text style={styles.tagText}>{addr.tag}</Text>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={styles.addrName}>{addr.name}</Text>
            <Text style={styles.addrPhone}>{addr.phone}</Text>
            <Text style={styles.addrLine}>{addr.line1}</Text>
            <Text style={styles.addrLine}>{addr.line2}</Text>

            <View style={styles.cardActions}>
              {!addr.isDefault && (
                <TouchableOpacity style={styles.setDefaultBtn} activeOpacity={0.8} onPress={() => setDefault(addr.id)}>
                  <Text style={styles.setDefaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8}>
                <MaterialCommunityIcons name="trash-can-outline" size={16} color="#D32F2F" />
                <Text style={styles.deleteText}> Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add new address */}
        <TouchableOpacity style={styles.addCard} activeOpacity={0.8}>
          <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#0C831F" />
          <Text style={styles.addText}>Add New Address</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tagText: { fontSize: 13, fontWeight: '700', color: '#0C831F', marginLeft: 4 },
  defaultBadge: { backgroundColor: '#E8F5E9', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 6 },
  defaultText: { fontSize: 11, color: '#0C831F', fontWeight: '600' },
  addrName: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 2 },
  addrPhone: { fontSize: 12, color: '#888', marginBottom: 6 },
  addrLine: { fontSize: 13, color: '#444', lineHeight: 20 },
  cardActions: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  setDefaultBtn: {
    borderWidth: 1.5, borderColor: '#0C831F', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  setDefaultText: { color: '#0C831F', fontSize: 12, fontWeight: '700' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  deleteText: { color: '#D32F2F', fontSize: 12, fontWeight: '600' },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#0C831F',
    borderStyle: 'dashed',
    gap: 8,
  },
  addText: { fontSize: 14, color: '#0C831F', fontWeight: '700' },
});
