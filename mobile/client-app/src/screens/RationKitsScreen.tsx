import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RationItem {
  id: string;
  name: string;
  quantity: string;
  emoji: string;
}

interface RationKit {
  members: number;
  name: string;
  description: string;
  price: number;
  items: RationItem[];
  savings: number;
}

const RATION_KITS: RationKit[] = [
  {
    members: 3,
    name: 'Small Family Kit',
    description: 'Perfect for 3 members • 1 Month Supply',
    price: 1599,
    savings: 200,
    items: [
      { id: 'atta-5kg', name: 'Whole Wheat Atta', quantity: '5 kg', emoji: '🌾' },
      { id: 'rice-5kg', name: 'Basmati Rice', quantity: '5 kg', emoji: '🍚' },
      { id: 'dal-2kg', name: 'Toor Dal', quantity: '2 kg', emoji: '🫘' },
      { id: 'oil-2l', name: 'Sunflower Oil', quantity: '2 L', emoji: '🫙' },
      { id: 'sugar-1kg', name: 'Sugar', quantity: '1 kg', emoji: '🧂' },
      { id: 'salt-1kg', name: 'Tata Salt', quantity: '1 kg', emoji: '🧂' },
    ],
  },
  {
    members: 5,
    name: 'Medium Family Kit',
    description: 'Perfect for 5 members • 1 Month Supply',
    price: 2499,
    savings: 350,
    items: [
      { id: 'atta-10kg', name: 'Whole Wheat Atta', quantity: '10 kg', emoji: '🌾' },
      { id: 'rice-10kg', name: 'Basmati Rice', quantity: '10 kg', emoji: '🍚' },
      { id: 'dal-3kg', name: 'Toor Dal', quantity: '3 kg', emoji: '🫘' },
      { id: 'oil-3l', name: 'Sunflower Oil', quantity: '3 L', emoji: '🫙' },
      { id: 'sugar-2kg', name: 'Sugar', quantity: '2 kg', emoji: '🧂' },
      { id: 'salt-1kg', name: 'Tata Salt', quantity: '1 kg', emoji: '🧂' },
      { id: 'tea-500g', name: 'Tea Powder', quantity: '500 g', emoji: '🍵' },
    ],
  },
  {
    members: 7,
    name: 'Large Family Kit',
    description: 'Perfect for 7 members • 1 Month Supply',
    price: 3299,
    savings: 500,
    items: [
      { id: 'atta-15kg', name: 'Whole Wheat Atta', quantity: '15 kg', emoji: '🌾' },
      { id: 'rice-15kg', name: 'Basmati Rice', quantity: '15 kg', emoji: '🍚' },
      { id: 'dal-5kg', name: 'Toor Dal', quantity: '5 kg', emoji: '🫘' },
      { id: 'oil-5l', name: 'Sunflower Oil', quantity: '5 L', emoji: '🫙' },
      { id: 'sugar-3kg', name: 'Sugar', quantity: '3 kg', emoji: '🧂' },
      { id: 'salt-2kg', name: 'Tata Salt', quantity: '2 kg', emoji: '🧂' },
      { id: 'tea-1kg', name: 'Tea Powder', quantity: '1 kg', emoji: '🍵' },
      { id: 'masala-mix', name: 'Spice Combo', quantity: '1 set', emoji: '🌶️' },
    ],
  },
  {
    members: 10,
    name: 'Extra Large Family Kit',
    description: 'Perfect for 10 members • 1 Month Supply',
    price: 4799,
    savings: 700,
    items: [
      { id: 'atta-25kg', name: 'Whole Wheat Atta', quantity: '25 kg', emoji: '🌾' },
      { id: 'rice-25kg', name: 'Basmati Rice', quantity: '25 kg', emoji: '🍚' },
      { id: 'dal-7kg', name: 'Toor Dal', quantity: '7 kg', emoji: '🫘' },
      { id: 'oil-7l', name: 'Sunflower Oil', quantity: '7 L', emoji: '🫙' },
      { id: 'sugar-5kg', name: 'Sugar', quantity: '5 kg', emoji: '🧂' },
      { id: 'salt-3kg', name: 'Tata Salt', quantity: '3 kg', emoji: '🧂' },
      { id: 'tea-1.5kg', name: 'Tea Powder', quantity: '1.5 kg', emoji: '🍵' },
      { id: 'masala-premium', name: 'Premium Spice Combo', quantity: '1 set', emoji: '🌶️' },
      { id: 'ghee-1kg', name: 'Pure Ghee', quantity: '1 kg', emoji: '🧈' },
    ],
  },
];

interface Props {
  onGoBack: () => void;
  onAddKitToCart: (kit: RationKit) => void;
}

export default function RationKitsScreen({ onGoBack, onAddKitToCart }: Props) {
  const [selectedKit, setSelectedKit] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Ration Kits</Text>
          <Text style={styles.headerSub}>Monthly essentials for your family</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information" size={20} color="#5B2D8E" />
          <Text style={styles.infoBannerText}>
            Save money with our curated monthly ration kits! Select based on your family size.
          </Text>
        </View>

        {/* Ration Kits */}
        {RATION_KITS.map((kit, index) => {
          const isExpanded = selectedKit === index;

          return (
            <View key={index} style={styles.kitCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedKit(isExpanded ? null : index)}
              >
                <View style={styles.kitHeader}>
                  <View style={styles.membersBadge}>
                    <MaterialCommunityIcons name="account-group" size={18} color="#5B2D8E" />
                    <Text style={styles.membersText}>  {kit.members} Members</Text>
                  </View>
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>Save ₹{kit.savings}</Text>
                  </View>
                </View>

                <Text style={styles.kitName}>{kit.name}</Text>
                <Text style={styles.kitDescription}>{kit.description}</Text>

                <View style={styles.kitPriceRow}>
                  <View>
                    <Text style={styles.kitPrice}>₹{kit.price}</Text>
                    <Text style={styles.originalPrice}>₹{kit.price + kit.savings}</Text>
                  </View>
                  <View style={styles.expandBtn}>
                    <Text style={styles.expandBtnText}>
                      {isExpanded ? 'Hide' : 'View'} Items
                    </Text>
                    <MaterialCommunityIcons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#5B2D8E"
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Expanded Items List */}
              {isExpanded && (
                <View style={styles.itemsList}>
                  <View style={styles.itemsDivider} />
                  <Text style={styles.itemsTitle}>What's included:</Text>
                  {kit.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Text style={styles.itemEmoji}>{item.emoji}</Text>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQty}>{item.quantity}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Add to Cart Button */}
              <TouchableOpacity
                style={styles.addBtn}
                activeOpacity={0.85}
                onPress={() => onAddKitToCart(kit)}
              >
                <MaterialCommunityIcons name="cart-plus" size={18} color="#fff" />
                <Text style={styles.addBtnText}>  Add Kit to Cart</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={{ height: 24 }} />
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
  headerSub: { fontSize: 12, color: '#888', marginTop: 2 },
  scroll: { flex: 1 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  infoBannerText: { flex: 1, fontSize: 12, color: '#5B2D8E', fontWeight: '600' },
  kitCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  kitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  membersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  membersText: { fontSize: 12, fontWeight: '700', color: '#5B2D8E' },
  savingsBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  savingsText: { fontSize: 11, fontWeight: '700', color: '#0C831F' },
  kitName: { fontSize: 17, fontWeight: '800', color: '#111', marginBottom: 4 },
  kitDescription: { fontSize: 12, color: '#666', marginBottom: 12 },
  kitPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kitPrice: { fontSize: 20, fontWeight: '800', color: '#5B2D8E' },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandBtnText: { fontSize: 13, fontWeight: '600', color: '#5B2D8E' },
  itemsList: { marginTop: 12 },
  itemsDivider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 12 },
  itemsTitle: { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemEmoji: { fontSize: 18, marginRight: 10, width: 24 },
  itemName: { flex: 1, fontSize: 12, color: '#555' },
  itemQty: { fontSize: 12, fontWeight: '600', color: '#333' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B2D8E',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 12,
  },
  addBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
