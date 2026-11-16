import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';
import { apiClient } from '../services/ApiClient';
import { ordersService } from '../services/OrdersService';
import { CreateOrderRequest } from '../types/orders.types';
import { formatProductForDisplay } from '../utils/productFormatter';

const PURPLE = '#5B2D8E';

const PAYMENT_METHODS = [
  { id: 'upi',     label: 'UPI',                  subLabel: 'Pay via any UPI app',         icon: 'contactless-payment',  color: '#1A237E', apiValue: 'UPI' },
  { id: 'gpay',    label: 'Google Pay',            subLabel: 'Fast & secure payments',      icon: 'google',               color: '#4285F4', apiValue: 'UPI' },
  { id: 'phonepe', label: 'PhonePe',               subLabel: 'UPI powered by PhonePe',      icon: 'cellphone',            color: '#5F259F', apiValue: 'UPI' },
  { id: 'paytm',   label: 'Paytm',                 subLabel: 'Paytm Wallet or UPI',         icon: 'wallet-outline',       color: '#00B9F1', apiValue: 'WALLET' },
  { id: 'card',    label: 'Credit / Debit Card',   subLabel: 'Visa, Mastercard, RuPay',     icon: 'credit-card-outline',  color: '#E65100', apiValue: 'CARD' },
  { id: 'cod',     label: 'Cash on Delivery',      subLabel: 'Pay when your order arrives', icon: 'cash-multiple',        color: '#0C831F', apiValue: 'CASH' },
];

interface Props {
  total: number;
  cartState: Record<string, number>;
  onGoBack: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export default function CheckoutScreen({ total, cartState, onGoBack, onOrderPlaced }: Props) {
  const [selected, setSelected] = useState('cod');
  const [placing, setPlacing]   = useState(false);
  const { products: allProducts } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);

  console.log('[CHECKOUT] Current user:', user);
  console.log('[CHECKOUT] User role:', user?.role);

  const deliveryFee = 19;
  const subtotalWithDelivery = total - deliveryFee;
  const baseSubtotal = Math.round(subtotalWithDelivery / 1.08);
  const gst = Math.round(baseSubtotal * 0.05);
  const tax = Math.round(baseSubtotal * 0.03);
  const subtotal = baseSubtotal;

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);

      // Debug: Check if token exists
      const { secureStorage } = await import('../services/SecureStorageService');
      const token = await secureStorage.getAccessToken();
      const user = await secureStorage.getUser();
      console.log('[CHECKOUT] Token exists:', !!token);
      console.log('[CHECKOUT] User:', user);
      console.log('[CHECKOUT] User role:', user?.role);

      if (!token) {
        Alert.alert('Authentication Error', 'Please log in to place an order');
        setPlacing(false);
        return;
      }

      // Test if token works with products endpoint
      console.log('[CHECKOUT] Testing token with /api/v1/products...');
      const testResponse = await apiClient.get('/api/v1/products?limit=1');
      console.log('[CHECKOUT] Products test response:', testResponse.success ? 'SUCCESS' : 'FAILED');
      if (!testResponse.success) {
        Alert.alert('Auth Error', 'Token is invalid or expired. Please log in again.');
        setPlacing(false);
        return;
      }

      // Build cart items for the order
      const orderItems = Object.entries(cartState)
        .filter(([, qty]) => qty > 0)
        .map(([variantId, quantity]) => {
          const product = allProducts.find((p) =>
            p.variants?.some((v) => v.id === variantId)
          );
          const variant = product?.variants?.find((v) => v.id === variantId);
          return {
            variantId,
            quantity,
            price: Number(variant?.sellingPrice) || 0, // ✅ Convert to number
          };
        });

      const orderRequest: CreateOrderRequest = {
        items: orderItems,
        paymentMethod: PAYMENT_METHODS.find(pm => pm.id === selected)?.apiValue || 'CASH',
        orderType: 'B2C_ONLINE',
        // customerId is auto-set by backend for CUSTOMER role - don't send it
        // sourceLocationId defaults to primary warehouse for customers
        // discountAmount is forced to 0 for customers
      };

      const order = await ordersService.createOrder(orderRequest);
      onOrderPlaced(order.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      console.error('[CHECKOUT] Order placement error:', message);
      Alert.alert('Error', message);
      setPlacing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Delivery address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={PURPLE} />
            <Text style={styles.cardTitle}>Delivering to</Text>
          </View>
          <Text style={styles.addrName}>Rohan Mehta</Text>
          <Text style={styles.addrLine}>1234, 1st Floor, Hi Tech City</Text>
          <Text style={styles.addrLine}>Hyderabad – 500081</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changeLink}>Change Address</Text>
          </TouchableOpacity>
        </View>

        {/* Bill summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="receipt" size={20} color={PURPLE} />
            <Text style={styles.cardTitle}>Order Summary</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
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
          <View style={[styles.billRow, styles.billTotal]}>
            <Text style={styles.billTotalLabel}>Grand Total</Text>
            <Text style={styles.billTotalValue}>₹{total}</Text>
          </View>
        </View>

        {/* Payment methods */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color={PURPLE} />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.pmRow, selected === pm.id && styles.pmRowActive]}
              activeOpacity={0.75}
              onPress={() => setSelected(pm.id)}
            >
              <View style={[styles.pmIcon, { backgroundColor: pm.color + '18' }]}>
                <MaterialCommunityIcons name={pm.icon as any} size={22} color={pm.color} />
              </View>
              <View style={styles.pmInfo}>
                <Text style={styles.pmLabel}>{pm.label}</Text>
                <Text style={styles.pmSub}>{pm.subLabel}</Text>
              </View>
              <MaterialCommunityIcons
                name={selected === pm.id ? 'radiobox-marked' : 'radiobox-blank'}
                size={22}
                color={selected === pm.id ? PURPLE : '#ccc'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Place Order bar */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotal}>₹{total}</Text>
          <Text style={styles.footerSub}>Total payable</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeBtn, placing && { opacity: 0.7 }]}
          activeOpacity={0.85}
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          <Text style={styles.placeBtnText}>{placing ? 'Placing Order...' : 'Place Order'}</Text>
          {!placing && <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff', paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 2,
  },
  backBtn: { marginRight: 12, padding: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  scroll: { flex: 1 },
  card: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 14, padding: 16,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  cardTitle:  { fontSize: 15, fontWeight: '800', color: '#111' },
  addrName:   { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 3 },
  addrLine:   { fontSize: 13, color: '#555', lineHeight: 20 },
  changeLink: { fontSize: 13, color: PURPLE, fontWeight: '700', marginTop: 8 },
  billRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel:  { fontSize: 13, color: '#555' },
  billValue:  { fontSize: 13, color: '#333' },
  billTotal:  { marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  billTotalLabel: { fontSize: 15, fontWeight: '800', color: '#111' },
  billTotalValue: { fontSize: 15, fontWeight: '800', color: '#111' },
  pmRow: {
    flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8,
    borderWidth: 1.5, borderColor: 'transparent', backgroundColor: '#fafafa',
  },
  pmRowActive: { borderColor: PURPLE, backgroundColor: '#F3EEF9' },
  pmIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  pmInfo: { flex: 1 },
  pmLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  pmSub:   { fontSize: 11, color: '#888', marginTop: 2 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, paddingBottom: 28, borderTopWidth: 1, borderTopColor: '#eee',
    elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 6,
  },
  footerTotal: { fontSize: 18, fontWeight: '800', color: '#111' },
  footerSub:   { fontSize: 11, color: '#888' },
  placeBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: PURPLE,
    borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, gap: 8,
  },
  placeBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
