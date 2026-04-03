import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Pressable, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MENU_SECTIONS = [
  {
    title: 'My Account',
    items: [
      { icon: 'shopping-outline',     label: 'My Orders',         count: 4,    nav: 'myOrders'       },
      { icon: 'map-marker-outline',   label: 'Saved Addresses',   count: 2,    nav: 'savedAddresses' },
      { icon: 'credit-card-outline',  label: 'Payment Methods',   count: null, nav: 'paymentMethods' },
    ],
  },
  {
    title: 'More',
    items: [
      { icon: 'help-circle-outline',    label: 'Help & Support',     count: null, nav: 'helpSupport'    },
      { icon: 'shield-check-outline',   label: 'Privacy Policy',     count: null, nav: 'privacyPolicy'  },
      { icon: 'file-document-outline',  label: 'Terms & Conditions', count: null, nav: 'termsConditions' },
      { icon: 'star-outline',           label: 'Rate the App',       count: null, nav: null             },
    ],
  },
];

interface Props {
  onGoBack?: () => void;
  onNavigate?: (screen: string) => void;
  onSignOut?: () => void;
}

export default function ProfileScreen({ onGoBack, onNavigate, onSignOut }: Props) {
  const [editVisible, setEditVisible] = useState(false);
  const [name, setName]   = useState('Rohan Mehta');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rohan.mehta@email.com');

  const [draftName,  setDraftName]  = useState(name);
  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftEmail, setDraftEmail] = useState(email);

  const openEdit = () => {
    setDraftName(name);
    setDraftPhone(phone);
    setDraftEmail(email);
    setEditVisible(true);
  };

  const saveEdit = () => {
    setName(draftName);
    setPhone(draftPhone);
    setEmail(draftEmail);
    setEditVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onGoBack && (
          <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="account" size={52} color="#fff" />
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userPhone}>{phone}</Text>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8} onPress={openEdit}>
            <MaterialCommunityIcons name="pencil-outline" size={14} color="#0C831F" />
            <Text style={styles.editBtnText}> Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Coupon promo */}
        <TouchableOpacity style={styles.promoBanner} activeOpacity={0.85}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={22} color="#FF6B00" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.promoTitle}>You have 2 coupons!</Text>
            <Text style={styles.promoSub}>Use them before they expire</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#FF6B00" />
        </TouchableOpacity>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuRow, idx < section.items.length - 1 && styles.menuRowBorder]}
                  activeOpacity={0.7}
                  onPress={() => item.nav && onNavigate?.(item.nav)}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color="#555"
                    style={{ marginRight: 14 }}
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.count !== null && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.count}</Text>
                    </View>
                  )}
                  <MaterialCommunityIcons name="chevron-right" size={18} color="#ccc" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8} onPress={onSignOut}>
          <MaterialCommunityIcons name="logout" size={18} color="#D32F2F" />
          <Text style={styles.signOutText}> Sign Out</Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setEditVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%' }}
          >
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.handle} />
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setEditVisible(false)} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="close" size={22} color="#555" />
                </TouchableOpacity>
              </View>

              {/* Avatar placeholder */}
              <View style={styles.editAvatarRow}>
                <View style={styles.editAvatarCircle}>
                  <MaterialCommunityIcons name="account" size={36} color="#fff" />
                </View>
                <TouchableOpacity style={styles.changePhotoBtn} activeOpacity={0.8}>
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Your full name"
                placeholderTextColor="#aaa"
              />

              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={draftPhone}
                onChangeText={setDraftPhone}
                keyboardType="phone-pad"
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor="#aaa"
              />

              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={draftEmail}
                onChangeText={setDraftEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@email.com"
                placeholderTextColor="#aaa"
              />

              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
              <View style={{ height: 24 }} />
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
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
  backBtn: {
    marginRight: 12,
    padding: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  scroll: { flex: 1 },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 28,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0C831F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#0C831F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  userName:  { fontSize: 20, fontWeight: '800', color: '#111' },
  userPhone: { fontSize: 13, color: '#888', marginTop: 3 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#0C831F',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  editBtnText: { fontSize: 13, color: '#0C831F', fontWeight: '600' },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  promoTitle: { fontSize: 13, fontWeight: '700', color: '#E65100' },
  promoSub:   { fontSize: 11, color: '#888', marginTop: 2 },
  section:    { marginBottom: 10 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    paddingHorizontal: 16,
    paddingBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuLabel: { fontSize: 14, color: '#222', flex: 1 },
  badge: {
    backgroundColor: '#0C831F',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
  },
  signOutText: { fontSize: 14, fontWeight: '700', color: '#D32F2F' },

  // Edit Profile Bottom Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  editAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  editAvatarCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#0C831F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoBtn: {
    borderWidth: 1.5,
    borderColor: '#0C831F',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  changePhotoText: { color: '#0C831F', fontSize: 13, fontWeight: '600' },
  fieldLabel: {
    fontSize: 12, fontWeight: '700', color: '#888',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: '#0C831F',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
