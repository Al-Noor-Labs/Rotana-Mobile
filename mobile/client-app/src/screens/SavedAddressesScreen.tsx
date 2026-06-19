import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAddresses, deleteAddress, setDefaultAddress } from '../store/slices/addressesSlice';

interface Props {
  onGoBack: () => void;
  onNavigate?: (screen: string) => void;
}

export default function SavedAddressesScreen({ onGoBack, onNavigate }: Props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { addresses, isLoading, error } = useAppSelector((state) => state.addresses);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('[SAVED_ADDRESSES] Screen mounted, fetching addresses');
      dispatch(fetchAddresses());
    }
  }, [dispatch, isAuthenticated]);

  const getAddressIcon = (label: string) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('home')) return 'home-variant-outline';
    if (labelLower.includes('work')) return 'briefcase-outline';
    if (labelLower.includes('parent')) return 'heart-outline';
    return 'map-marker-outline';
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteAddress(id)),
        },
      ]
    );
  };

  const handleSetDefault = (id: string | undefined) => {
    if (!id) return;
    dispatch(setDefaultAddress(id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
      </View>

      {isLoading && !addresses.length ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0C831F" />
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchAddresses())}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={{ height: 12 }} />
          {addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="home-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No addresses yet</Text>
              <Text style={styles.emptySubtext}>Add your first address to get started</Text>
            </View>
          ) : (
            addresses.map((addr) => (
              <View key={addr.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.tagRow}>
                    <MaterialCommunityIcons name={getAddressIcon(addr.label) as any} size={16} color="#0C831F" />
                    <Text style={styles.tagText}>{addr.label}</Text>
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

                <Text style={styles.addrLine}>{addr.line1}</Text>
                {addr.line2 && <Text style={styles.addrLine}>{addr.line2}</Text>}
                <Text style={styles.addrCity}>
                  {addr.city}, {addr.state} - {addr.pincode}
                </Text>

                <View style={styles.cardActions}>
                  {!addr.isDefault && (
                    <TouchableOpacity
                      style={styles.setDefaultBtn}
                      activeOpacity={0.8}
                      onPress={() => handleSetDefault(addr.id)}
                    >
                      <Text style={styles.setDefaultText}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    activeOpacity={0.8}
                    onPress={() => handleDelete(addr.id)}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={16} color="#D32F2F" />
                    <Text style={styles.deleteText}> Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Add new address */}
          <TouchableOpacity
            style={styles.addCard}
            activeOpacity={0.8}
            onPress={() => onNavigate?.('addAddress')}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#0C831F" />
            <Text style={styles.addText}>Add New Address</Text>
          </TouchableOpacity>
          <View style={{ height: 32 }} />
        </ScrollView>
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
  scroll: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { fontSize: 14, color: '#888', marginTop: 12 },
  errorText: { fontSize: 14, color: '#D32F2F', marginTop: 12, textAlign: 'center' },
  retryBtn: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#0C831F', borderRadius: 8 },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#888', marginTop: 12 },
  emptySubtext: { fontSize: 12, color: '#aaa', marginTop: 4 },
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
  addrLine: { fontSize: 13, color: '#444', lineHeight: 20, marginBottom: 4 },
  addrCity: { fontSize: 13, color: '#666', fontWeight: '500', marginTop: 4 },
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
