import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ORDERS = [
  {
    id: 'ORD-10234',
    date: 'Mar 10, 2026',
    status: 'Delivered',
    statusColor: '#0C831F',
    items: ['Amul Butter 500g', 'Whole Wheat Bread', 'Farm Fresh Milk 1L'],
    total: 379,
    deliveryTime: 'Delivered in 12 mins',
    address: '1234, 1st Floor, Hi Tech City, Hyderabad',
  },
  {
    id: 'ORD-10191',
    date: 'Mar 7, 2026',
    status: 'Delivered',
    statusColor: '#0C831F',
    items: ['Chicken Curry Cut 400g', 'Tata Salt 1kg', 'Maggi Noodles x3'],
    total: 562,
    deliveryTime: 'Delivered in 9 mins',
    address: '1234, 1st Floor, Hi Tech City, Hyderabad',
  },
  {
    id: 'ORD-10145',
    date: 'Mar 2, 2026',
    status: 'Cancelled',
    statusColor: '#D32F2F',
    items: ['Sunflower Oil 1L', 'Eggs (12 pack)', 'Chips & Namkeen Combo'],
    total: 410,
    deliveryTime: 'Order cancelled',
    address: 'Office: 12, Tech Park, Malad',
  },
  {
    id: 'ORD-10089',
    date: 'Feb 25, 2026',
    status: 'Delivered',
    statusColor: '#0C831F',
    items: ['Basmati Rice 5kg', 'Atta 10kg', 'Saffola Gold 1L'],
    total: 1148,
    deliveryTime: 'Delivered in 14 mins',
    address: '1234, 1st Floor, Hi Tech City, Hyderabad',
  },
];

interface Props {
  onGoBack: () => void;
}

export default function MyOrdersScreen({ onGoBack }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ height: 12 }} />
        {ORDERS.map((order) => {
          const expanded = expandedId === order.id;
          return (
            <TouchableOpacity
              key={order.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => setExpandedId(expanded ? null : order.id)}
            >
              {/* Top row */}
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { borderColor: order.statusColor }]}>
                  <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
                </View>
              </View>

              {/* Items preview */}
              <Text style={styles.itemsText} numberOfLines={expanded ? undefined : 1}>
                {order.items.join('  ·  ')}
              </Text>

              {/* Expanded detail */}
              {expanded && (
                <View style={styles.expandedSection}>
                  <View style={styles.divider} />
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color="#888" />
                    <Text style={styles.detailText}>{order.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="lightning-bolt" size={16} color="#888" />
                    <Text style={styles.detailText}>{order.deliveryTime}</Text>
                  </View>
                </View>
              )}

              {/* Bottom row */}
              <View style={styles.cardBottom}>
                <Text style={styles.totalText}>₹{order.total}</Text>
                <TouchableOpacity style={styles.reorderBtn} activeOpacity={0.8}>
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderId: { fontSize: 14, fontWeight: '700', color: '#111' },
  orderDate: { fontSize: 12, color: '#888', marginTop: 2 },
  statusBadge: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  itemsText: { fontSize: 13, color: '#555', lineHeight: 20 },
  expandedSection: { marginTop: 8 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailText: { fontSize: 12, color: '#666', marginLeft: 8, flex: 1 },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalText: { fontSize: 16, fontWeight: '800', color: '#111' },
  reorderBtn: {
    borderWidth: 1.5,
    borderColor: '#0C831F',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  reorderText: { color: '#0C831F', fontSize: 13, fontWeight: '700' },
});
