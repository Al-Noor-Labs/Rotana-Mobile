import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddButton from '../components/AddButton';
import { getProduct } from '../data/productRegistry';

interface Props {
  cartState: Record<string, number>;
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout?: (total: number) => void;
  onGoBack?: () => void;
}

export default function CartScreen({ cartState, onAddToCart, onRemoveFromCart, onCheckout, onGoBack }: Props) {
  // Build cart items dynamically from cartState + product registry
  const activeItems = Object.entries(cartState)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const meta = getProduct(id);
      return {
        id,
        qty,
        name:   meta?.name   ?? id,
        brand:  meta?.brand  ?? '',
        weight: meta?.weight ?? '',
        price:  meta?.price  ?? 0,
        emoji:  meta?.emoji  ?? '📦',
      };
    });

  const subtotal = activeItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = subtotal > 0 ? 19 : 0;
  const gst = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST
  const tax = subtotal > 0 ? Math.round(subtotal * 0.03) : 0; // 3% Tax
  const total = subtotal + deliveryFee + gst + tax;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Cart</Text>
          {activeItems.length > 0 && (
            <Text style={styles.headerSub}>{activeItems.length} item{activeItems.length > 1 ? 's' : ''}</Text>
          )}
        </View>
      </View>

      {activeItems.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="cart-outline" size={72} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items from home to get started</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Delivery banner */}
          <View style={styles.deliveryBanner}>
            <MaterialCommunityIcons name="clock-fast" size={16} color="#0C831F" />
            <Text style={styles.deliveryText}>
              {' '}Delivery in <Text style={{ fontWeight: '800' }}>10 minutes</Text>
            </Text>
          </View>

          {/* Items */}
          {activeItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemImageBox}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}{item.weight ? ` • ${item.weight}` : ''}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
              </View>
              <AddButton
                productId={item.id}
                quantity={item.qty}
                onAdd={onAddToCart}
                onRemove={onRemoveFromCart}
              />
            </View>
          ))}

          {/* Bill summary */}
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Bill Details</Text>
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
              <Text style={styles.billTotalValue}>₹{total}</Text>
            </View>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {activeItems.length > 0 && (
        <View style={styles.checkoutBar}>
          <View>
            <Text style={styles.checkoutTotal}>₹{total}</Text>
            <Text style={styles.checkoutSub}>Total (incl. delivery)</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85} onPress={() => onCheckout?.(total)}>
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
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
  headerSub:   { fontSize: 12, color: '#888', marginTop: 2 },
  emptyState:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle:  { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 16 },
  emptySub:    { fontSize: 13, color: '#888', marginTop: 6 },
  scroll: { flex: 1 },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  deliveryText: { fontSize: 13, color: '#0C831F' },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemImageBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji:   { fontSize: 28 },
  itemDetails: { flex: 1 },
  itemName:    { fontSize: 13, fontWeight: '700', color: '#111' },
  itemBrand:   { fontSize: 11, color: '#888', marginTop: 2 },
  itemPrice:   { fontSize: 14, fontWeight: '800', color: '#111', marginTop: 4 },
  billCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  billTitle:      { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 12 },
  billRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billRowTotal:   { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  billLabel:      { fontSize: 13, color: '#555' },
  billValue:      { fontSize: 13, color: '#333' },
  billTotalLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  billTotalValue: { fontSize: 14, fontWeight: '800', color: '#111' },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  checkoutTotal:   { fontSize: 18, fontWeight: '800', color: '#111' },
  checkoutSub:     { fontSize: 11, color: '#888' },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C831F',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  checkoutBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
