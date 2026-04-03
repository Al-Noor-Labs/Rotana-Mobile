import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  weight: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  deliveryTime?: string;
  paymentMethod: string;
}

interface Props {
  order: Order;
  onGoBack: () => void;
  onReorder: (items: OrderItem[]) => void;
}

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#0C831F',
  Cancelled: '#D32F2F',
  Processing: '#E65100',
};

export default function OrderDetailsScreen({ order, onGoBack, onReorder }: Props) {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 19;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const tax = Math.round(subtotal * 0.03); // 3% Tax

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSub}>Order #{order.id}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] + '22' }]}>
              <MaterialCommunityIcons
                name={order.status === 'Delivered' ? 'check-circle' : order.status === 'Cancelled' ? 'close-circle' : 'clock-outline'}
                size={16}
                color={STATUS_COLORS[order.status]}
              />
              <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] }]}>  {order.status}</Text>
            </View>
          </View>
          <Text style={styles.orderDate}>Placed on {order.date}</Text>
          {order.deliveryTime && (
            <Text style={styles.deliveryTime}>Delivered on {order.deliveryTime}</Text>
          )}
        </View>

        {/* Items List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
          {order.items.map((item, index) => (
            <View key={index}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.itemRow}>
                <View style={styles.itemImageBox}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemBrand}>{item.brand} • {item.weight}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                <View style={styles.itemQty}>
                  <Text style={styles.qtyText}>Qty: {item.quantity}</Text>
                  <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bill Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery fee</Text>
            <Text style={styles.billValue}>₹{deliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST (5%)</Text>
            <Text style={styles.billValue}>₹{gst}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tax (3%)</Text>
            <Text style={styles.billValue}>₹{tax}</Text>
          </View>
          <View style={[styles.billRow, styles.billRowTotal]}>
            <Text style={styles.billTotalLabel}>Grand Total</Text>
            <Text style={styles.billTotalValue}>₹{order.total}</Text>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#5B2D8E" />
            <Text style={styles.detailText}>{order.deliveryAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="credit-card" size={18} color="#5B2D8E" />
            <Text style={styles.detailText}>{order.paymentMethod}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Reorder Button */}
      {order.status === 'Delivered' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.reorderBtn}
            activeOpacity={0.85}
            onPress={() => onReorder(order.items)}
          >
            <MaterialCommunityIcons name="repeat" size={18} color="#fff" />
            <Text style={styles.reorderBtnText}>  Reorder All Items</Text>
          </TouchableOpacity>
        </View>
      )}
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
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: { fontSize: 13, fontWeight: '700' },
  orderDate: { fontSize: 12, color: '#666', marginTop: 4 },
  deliveryTime: { fontSize: 12, color: '#0C831F', marginTop: 2, fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemImageBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: { fontSize: 24 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#111' },
  itemBrand: { fontSize: 11, color: '#888', marginTop: 2 },
  itemPrice: { fontSize: 12, fontWeight: '600', color: '#666', marginTop: 2 },
  itemQty: { alignItems: 'flex-end' },
  qtyText: { fontSize: 11, color: '#888' },
  itemTotal: { fontSize: 14, fontWeight: '800', color: '#111', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billRowTotal: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  billLabel: { fontSize: 13, color: '#555' },
  billValue: { fontSize: 13, color: '#333' },
  billTotalLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  billTotalValue: { fontSize: 14, fontWeight: '800', color: '#111' },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  detailText: { fontSize: 13, color: '#555', marginLeft: 10, flex: 1 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B2D8E',
    borderRadius: 10,
    paddingVertical: 14,
  },
  reorderBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
