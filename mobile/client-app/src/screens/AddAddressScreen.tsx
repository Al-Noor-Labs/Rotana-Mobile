import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import { addAddress } from '../store/slices/addressesSlice';
import { Address } from '../types/address.types';

const LABEL_OPTIONS = ['Home', 'Work', 'Parents', 'Other'];
const STATES = [
  'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka',
  'Tamil Nadu', 'Uttar Pradesh', 'Delhi', 'Punjab',
];

interface Props {
  onGoBack?: () => void;
  onSuccess?: () => void;
}

export default function AddAddressScreen({ onGoBack, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: 'Telangana',
    pincode: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.label.trim()) newErrors.label = 'Label is required';
    if (!form.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const addressData: Address = {
        label: form.label,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        isDefault: form.isDefault,
      };

      console.log('[ADD_ADDRESS] Submitting address:', addressData);
      await dispatch(addAddress(addressData)).unwrap();

      Alert.alert('Success', 'Address added successfully!', [
        { text: 'OK', onPress: () => onSuccess?.() },
      ]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add address';
      console.error('[ADD_ADDRESS] Error:', errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>

      {/* Form */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Label */}
          <View style={styles.section}>
            <Text style={styles.label}>Address Type *</Text>
            <View style={styles.labelOptions}>
              {LABEL_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.labelBtn,
                    form.label === option && styles.labelBtnActive,
                  ]}
                  onPress={() => setForm({ ...form, label: option })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.labelBtnText,
                      form.label === option && styles.labelBtnTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.label && <Text style={styles.error}>{errors.label}</Text>}
          </View>

          {/* Line 1 */}
          <View style={styles.section}>
            <Text style={styles.label}>Address Line 1 *</Text>
            <TextInput
              style={[styles.input, errors.line1 && styles.inputError]}
              placeholder="e.g., 42 Green Park Avenue"
              value={form.line1}
              onChangeText={(text) => setForm({ ...form, line1: text })}
              editable={!loading}
            />
            {errors.line1 && <Text style={styles.error}>{errors.line1}</Text>}
          </View>

          {/* Line 2 */}
          <View style={styles.section}>
            <Text style={styles.label}>Address Line 2 (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Near City Mall, Apt 42"
              value={form.line2}
              onChangeText={(text) => setForm({ ...form, line2: text })}
              editable={!loading}
            />
          </View>

          {/* City */}
          <View style={styles.section}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="e.g., Hyderabad"
              value={form.city}
              onChangeText={(text) => setForm({ ...form, city: text })}
              editable={!loading}
            />
            {errors.city && <Text style={styles.error}>{errors.city}</Text>}
          </View>

          {/* State */}
          <View style={styles.section}>
            <Text style={styles.label}>State *</Text>
            <View style={styles.stateContainer}>
              {STATES.map((state) => (
                <TouchableOpacity
                  key={state}
                  style={[
                    styles.stateBtn,
                    form.state === state && styles.stateBtnActive,
                  ]}
                  onPress={() => setForm({ ...form, state })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.stateBtnText,
                      form.state === state && styles.stateBtnTextActive,
                    ]}
                  >
                    {state}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.state && <Text style={styles.error}>{errors.state}</Text>}
          </View>

          {/* Pincode */}
          <View style={styles.section}>
            <Text style={styles.label}>Pincode *</Text>
            <TextInput
              style={[styles.input, errors.pincode && styles.inputError]}
              placeholder="e.g., 500081"
              value={form.pincode}
              onChangeText={(text) => setForm({ ...form, pincode: text })}
              keyboardType="numeric"
              maxLength={6}
              editable={!loading}
            />
            {errors.pincode && <Text style={styles.error}>{errors.pincode}</Text>}
          </View>

          {/* Set as Default */}
          <View style={styles.section}>
            <View style={styles.defaultRow}>
              <View>
                <Text style={styles.label}>Set as Default</Text>
                <Text style={styles.subtitle}>Use this address by default</Text>
              </View>
              <Switch
                value={form.isDefault}
                onValueChange={(value) => setForm({ ...form, isDefault: value })}
                disabled={loading}
                trackColor={{ false: '#ddd', true: '#81C784' }}
                thumbColor={form.isDefault ? '#0C831F' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle-outline" size={18} color="#fff" />
                <Text style={styles.saveBtnText}> Save Address</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </View>
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
  form: { padding: 16 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#D32F2F', backgroundColor: '#FFEBEE' },
  error: { fontSize: 12, color: '#D32F2F', marginTop: 6 },
  labelOptions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  labelBtn: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  labelBtnActive: { borderColor: '#0C831F', backgroundColor: '#E8F5E9' },
  labelBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
  labelBtnTextActive: { color: '#0C831F' },
  stateContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  stateBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  stateBtnActive: { borderColor: '#0C831F', backgroundColor: '#E8F5E9' },
  stateBtnText: { fontSize: 12, color: '#555' },
  stateBtnTextActive: { color: '#0C831F', fontWeight: '600' },
  defaultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C831F',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
    gap: 6,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
