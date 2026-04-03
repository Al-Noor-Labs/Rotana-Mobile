import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#5B2D8E';

const STEPS = [
  { id: 0, label: 'Order Placed',     icon: 'check-circle-outline',   desc: 'We received your order' },
  { id: 1, label: 'Preparing',        icon: 'package-variant-closed', desc: 'Items being packed for you' },
  { id: 2, label: 'Out for Delivery', icon: 'bike',                   desc: 'Rider is on the way' },
  { id: 3, label: 'Delivered',        icon: 'home-check-outline',     desc: 'Enjoy your order!' },
];

interface Props {
  orderId: string;
  onGoBack: () => void;
  onContinueShopping: () => void;
}

export default function OrderTrackingScreen({ orderId, onGoBack, onContinueShopping }: Props) {
  const [step, setStep] = useState(1); // starts at Preparing

  // Simulate delivery progress
  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 5000);
    return () => clearTimeout(t1);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Map placeholder */}
        <View style={styles.mapPlaceholder}>
          <MaterialCommunityIcons name="map-outline" size={50} color="rgba(255,255,255,0.6)" />
          <Text style={styles.mapText}>Live map tracking coming soon</Text>
          {/* Rider card overlay */}
          <View style={styles.riderCard}>
            <View style={styles.riderAvatar}>
              <MaterialCommunityIcons name="account" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.riderName}>Ravi Kumar</Text>
              <Text style={styles.riderSub}>Your delivery partner</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
              <MaterialCommunityIcons name="phone" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ETA + Order ID */}
        <View style={styles.etaCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.etaLabel}>ORDER ID</Text>
            <Text style={styles.etaOrderId}>{orderId}</Text>
          </View>
          <View style={styles.etaBadge}>
            <MaterialCommunityIcons name="clock-fast" size={16} color="#0C831F" />
            <Text style={styles.etaTime}>  ~10 mins</Text>
          </View>
        </View>

        {/* Progress steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Order Status</Text>
          {STEPS.map((s, idx) => {
            const done    = idx <= step;
            const current = idx === step;
            return (
              <View key={s.id} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepDot, done && styles.stepDotDone, current && styles.stepDotCurrent]}>
                    <MaterialCommunityIcons
                      name={idx < step ? 'check' : (s.icon as any)}
                      size={16}
                      color={done ? '#fff' : '#bbb'}
                    />
                  </View>
                  {idx < STEPS.length - 1 && (
                    <View style={[styles.stepLine, idx < step && styles.stepLineDone]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{s.label}</Text>
                  {current && <Text style={styles.stepDesc}>{s.desc}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery address */}
        <View style={styles.addressCard}>
          <MaterialCommunityIcons name="map-marker" size={20} color={PURPLE} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.addressLabel}>DELIVERING TO</Text>
            <Text style={styles.addressLine}>1234, 1st Floor, Hi Tech City</Text>
            <Text style={styles.addressLine}>Hyderabad – 500081</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shopBtn} activeOpacity={0.8} onPress={onContinueShopping}>
          <Text style={styles.shopBtnText}>Continue Shopping</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
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

  mapPlaceholder: {
    height: 200, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center',
  },
  mapText: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 8, marginBottom: 16 },
  riderCard: {
    position: 'absolute', bottom: 12, left: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center',
  },
  riderAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center',
  },
  riderName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  riderSub:  { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  callBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#0C831F',
    justifyContent: 'center', alignItems: 'center',
  },

  etaCard: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  etaLabel:   { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  etaOrderId: { fontSize: 14, fontWeight: '800', color: '#111', marginTop: 2 },
  etaBadge:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  etaTime:    { fontSize: 14, fontWeight: '700', color: '#0C831F' },

  stepsCard: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 14, padding: 16,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  stepsTitle: { fontSize: 15, fontWeight: '800', color: '#111', marginBottom: 16 },
  stepRow:    { flexDirection: 'row' },
  stepLeft:   { alignItems: 'center', width: 36 },
  stepDot: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee',
    justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  stepDotDone:    { backgroundColor: '#0C831F' },
  stepDotCurrent: { backgroundColor: PURPLE },
  stepLine:     { width: 2, flex: 1, backgroundColor: '#eee', minHeight: 24, marginVertical: 2 },
  stepLineDone: { backgroundColor: '#0C831F' },
  stepContent:  { flex: 1, paddingLeft: 12, paddingBottom: 24, paddingTop: 8 },
  stepLabel:     { fontSize: 14, fontWeight: '700', color: '#bbb' },
  stepLabelDone: { color: '#111' },
  stepDesc:      { fontSize: 12, color: '#0C831F', marginTop: 3 },

  addressCard: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'flex-start',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  addressLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  addressLine:  { fontSize: 13, color: '#333', lineHeight: 20 },

  shopBtn: {
    marginHorizontal: 12, marginTop: 14, backgroundColor: '#fff', borderRadius: 12, padding: 15,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#ddd',
  },
  shopBtnText: { fontSize: 15, fontWeight: '700', color: '#555' },
});
