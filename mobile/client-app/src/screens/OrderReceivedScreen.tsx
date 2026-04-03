import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';

interface Props {
  orderId: string;
  total: number;
  onTrackOrder: () => void;
  onContinueShopping: () => void;
}

export default function OrderReceivedScreen({ orderId, total, onTrackOrder, onContinueShopping }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
      Animated.timing(fade,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success icon */}
        <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="check-bold" size={52} color="#fff" />
          </View>
          <View style={styles.ringOuter} />
        </Animated.View>

        <Animated.View style={[styles.info, { opacity: fade }]}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>Your order has been confirmed and{'\n'}is being prepared.</Text>
          <Text style={styles.orderId}>Order ID: {orderId}</Text>

          <View style={styles.deliveryBadge}>
            <MaterialCommunityIcons name="clock-fast" size={18} color="#0C831F" />
            <Text style={styles.deliveryText}>  Arriving in ~10 minutes</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount Paid</Text>
              <Text style={styles.summaryValue}>₹{total}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivering to</Text>
              <Text style={styles.summaryValue}>Hi Tech City, Hyderabad</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.trackBtn} activeOpacity={0.85} onPress={onTrackOrder}>
            <MaterialCommunityIcons name="map-marker-path" size={18} color="#fff" />
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shopBtn} activeOpacity={0.8} onPress={onContinueShopping}>
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content:   { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  iconWrap:  { marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#0C831F',
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#0C831F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
  ringOuter: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    borderWidth: 2, borderColor: '#0C831F', opacity: 0.25,
  },
  info: { alignItems: 'center', width: '100%' },
  title:    { fontSize: 28, fontWeight: '900', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 10 },
  orderId:  { fontSize: 13, color: '#888', marginBottom: 20 },
  deliveryBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9',
    borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10, marginBottom: 24,
  },
  deliveryText: { fontSize: 14, color: '#0C831F', fontWeight: '700' },
  summaryCard: {
    width: '100%', backgroundColor: '#f8f8f8', borderRadius: 14, padding: 16, marginBottom: 28,
    borderWidth: 1, borderColor: '#eee',
  },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryValue: { fontSize: 13, fontWeight: '700', color: '#111' },
  trackBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: PURPLE, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 14, marginBottom: 12,
    width: '100%', gap: 8,
  },
  trackBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  shopBtn: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 13, width: '100%', alignItems: 'center',
  },
  shopBtnText: { fontSize: 15, fontWeight: '700', color: '#555' },
});
