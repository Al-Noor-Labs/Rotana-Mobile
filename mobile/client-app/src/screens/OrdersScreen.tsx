import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Order } from './OrderDetailsScreen';

export const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    date: 'Mar 10, 2026',
    status: 'Delivered',
    total: 345,
    deliveryTime: 'Mar 10, 2026 at 3:45 PM',
    deliveryAddress: 'Home\n123 Main Street, Apartment 4B\nBangalore, Karnataka - 560001',
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 'c1', name: 'Amul Butter', brand: 'Amul', weight: '500 g', price: 275, quantity: 1, emoji: '🧈' },
      { id: 'c2', name: 'Whole Wheat Bread', brand: "Modern's", weight: '400 g', price: 42, quantity: 1, emoji: '🍞' },
      { id: 'c3', name: 'Farm Fresh Milk', brand: 'Heritage', weight: '1 L', price: 62, quantity: 1, emoji: '🥛' },
    ],
  },
  {
    id: 'ORD-0998',
    date: 'Mar 7, 2026',
    status: 'Delivered',
    total: 180,
    deliveryTime: 'Mar 7, 2026 at 6:20 PM',
    deliveryAddress: 'Home\n123 Main Street, Apartment 4B\nBangalore, Karnataka - 560001',
    paymentMethod: 'UPI Payment',
    items: [
      { id: 'home-p1', name: 'Chicken Curry Cut', brand: 'Local Farm', weight: '400 g', price: 180, quantity: 1, emoji: '🍗' },
    ],
  },
  {
    id: 'ORD-0975',
    date: 'Feb 28, 2026',
    status: 'Delivered',
    total: 620,
    deliveryTime: 'Feb 28, 2026 at 5:10 PM',
    deliveryAddress: 'Home\n123 Main Street, Apartment 4B\nBangalore, Karnataka - 560001',
    paymentMethod: 'Google Pay',
    items: [
      { id: 'c4', name: 'Sunflower Oil', brand: 'Saffola', weight: '5 L', price: 599, quantity: 1, emoji: '🫙' },
      { id: 'c1', name: 'Amul Butter', brand: 'Amul', weight: '500 g', price: 275, quantity: 2, emoji: '🧈' },
    ],
  },
  {
    id: 'ORD-0953',
    date: 'Feb 18, 2026',
    status: 'Cancelled',
    total: 145,
    deliveryAddress: 'Home\n123 Main Street, Apartment 4B\nBangalore, Karnataka - 560001',
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 'c2', name: 'Whole Wheat Bread', brand: "Modern's", weight: '400 g', price: 42, quantity: 2, emoji: '🍞' },
      { id: 'c3', name: 'Farm Fresh Milk', brand: 'Heritage', weight: '1 L', price: 62, quantity: 1, emoji: '🥛' },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#0C831F',
  Cancelled: '#D32F2F',
  Processing: '#E65100',
};

interface Props {
  onGoBack?: () => void;
  onOrderPress?: (order: Order) => void;
  onReorder?: (order: Order) => void;
}

export default function OrdersScreen({ onGoBack, onOrderPress, onReorder }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>{DUMMY_ORDERS.length} orders placed</Text>
        </View>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {DUMMY_ORDERS.map((order) => {
          const itemNames = order.items.slice(0, 3).map(i => i.name);
          if (order.items.length > 3) itemNames.push(`+${order.items.length - 3} more`);

          return (
            <TouchableOpacity
              key={order.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => onOrderPress?.(order)}
            >
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] + '22' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] }]}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.itemsList} numberOfLines={1}>
                {itemNames.join(' • ')}
              </Text>
              <View style={styles.cardBottom}>
                <Text style={styles.itemCount}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</Text>
                <Text style={styles.total}>₹{order.total}</Text>
              </View>
              {order.status === 'Delivered' && (
                <TouchableOpacity
                  style={styles.reorderBtn}
                  activeOpacity={0.8}
                  onPress={(e) => {
                    e.stopPropagation();
                    onReorder?.(order);
                  }}
                >
                  <MaterialCommunityIcons name="repeat" size={14} color="#5B2D8E" />
                  <Text style={styles.reorderText}> Reorder</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
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
  headerSub:   { fontSize: 12, color: '#888', marginTop: 2 },
  scroll: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId:     { fontSize: 13, fontWeight: '700', color: '#111' },
  orderDate:   { fontSize: 11, color: '#888', marginTop: 2 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  statusText:  { fontSize: 11, fontWeight: '700' },
  divider:     { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  itemsList:   { fontSize: 11, color: '#555', marginBottom: 10 },
  cardBottom:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemCount:   { fontSize: 11, color: '#888' },
  total:       { fontSize: 15, fontWeight: '800', color: '#111' },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#5B2D8E',
    borderRadius: 8,
    paddingVertical: 8,
  },
  reorderText: { fontSize: 13, fontWeight: '700', color: '#5B2D8E' },
});
