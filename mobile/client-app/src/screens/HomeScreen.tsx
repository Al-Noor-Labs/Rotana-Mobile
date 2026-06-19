import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAddresses, selectAddress } from '../store/slices/addressesSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import AddButton from '../components/AddButton';
import { CategoryShimmer } from '../components/CategoryShimmer';
import { getCategoryImage, getCategoryDisplayName } from '../utils/categoryImages';


const SEARCH_HINTS = [
  'atta',
  'eggs',
  'milk',
  'bread',
  'chicken',
  'rice',
  'maggi',
  'butter',
  'chips',
  'oil',
  'cold drink',
  'chocolates',
];

interface HomeScreenProps {
  onCategoryPress?: (name: string) => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  onCartPress?: () => void;
  onRationKitsPress?: () => void;
  onAddAddressPress?: () => void;
  cartState: Record<string, number>;
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
}

export default function HomeScreen({
  onCategoryPress,
  onSearchPress,
  onProfilePress,
  onCartPress,
  onRationKitsPress,
  onAddAddressPress,
  cartState,
  onAddToCart,
  onRemoveFromCart,
}: HomeScreenProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { categories: apiCategories, isLoading } = useAppSelector((state) => state.categories);
  const { addresses, selectedAddressId } = useAppSelector((state) => state.addresses);

  // Safety net: if categories are empty when HomeScreen mounts (e.g. splash fetch
  // was skipped due to auth failure), trigger the fetch here.
  useEffect(() => {
    if (apiCategories.length === 0 && !isLoading) {
      dispatch(fetchCategories());
    }
    // Only fetch addresses if user is authenticated
    if (isAuthenticated) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, apiCategories.length, isLoading, isAuthenticated]);

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);

  // Build categories array from API data with images and colors
  // Filter to ONLY show parent categories (no parentId)
  const categories = apiCategories.length > 0
    ? apiCategories
        .filter((cat) => !cat.parentId) // ✅ Only parent categories
        .filter((cat) => !cat.name.includes('Test Category'))
        .map((apiCat, idx) => {
          // Try to use API imageUrl first, fall back to local mapping
          let image = null;
          let bgColor = '#FFF3E0';

          if (apiCat.imageUrl) {
            // Use API image URL if available
            image = { uri: apiCat.imageUrl };
          } else {
            // Fall back to local image mapping
            const { image: localImg, bgColor: localBg } = getCategoryImage(apiCat.name, idx);
            image = localImg;
            bgColor = localBg;
          }

          const displayName = getCategoryDisplayName(apiCat.name);
          return {
            id: apiCat.id,
            name: displayName.replace(/\s+/g, '\n'),
            apiName: apiCat.name,
            image,
            bgColor,
            isFromApi: !!apiCat.imageUrl,
          };
        })
    : [];

  // ── Animated search hint ticker ─────────────────────────────────────────
  const [hintIndex, setHintIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(18)).current; // starts below
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Immediately show the first hint
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();

    const interval = setInterval(() => {
      // Slide out upward + fade out
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -18, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 220, useNativeDriver: true }),
      ]).start(() => {
        // Move to next hint, reset position to below, then slide in
        setHintIndex((prev) => (prev + 1) % SEARCH_HINTS.length);
        slideAnim.setValue(18);
        fadeAnim.setValue(0);
        Animated.parallel([
          Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
        ]).start();
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);
  // ────────────────────────────────────────────────────────────────────────
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  const insets = useSafeAreaInsets();

  const searchBar = (
    <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress} activeOpacity={0.9}>
      <MaterialCommunityIcons name="magnify" size={18} color="#888" style={{ marginRight: 8 }} />
      <View style={styles.searchHintClip}>
        <Text style={styles.searchHintStatic}>Search for </Text>
        <View style={styles.searchTickerBox}>
          <Animated.Text
            style={[
              styles.searchHintProduct,
              { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
            ]}
          >
            '{SEARCH_HINTS[hintIndex]}'
          </Animated.Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setStickyVisible(y >= headerHeight);
        }}
      >
        {/* Gradient header — scrolls away */}
        <LinearGradient
          colors={['#A855F7', '#5B2D8E']}
          style={styles.header}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.headerTop}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryLabel}>Delivery in</Text>
              <Text style={styles.deliveryTime}>10 Minutes</Text>
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() => setAddressModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.address} numberOfLines={1}>
                  {selectedAddress ? `${selectedAddress.line1}, ${selectedAddress.city}` : 'Select Address'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={14} color="rgba(255,255,255,0.8)" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.profileIcon} onPress={onProfilePress} activeOpacity={0.8}>
              <MaterialCommunityIcons name="account-circle-outline" size={26} color="#5B2D8E" />
            </TouchableOpacity>
          </View>
          {/* Search bar inside header — scrolls away with it */}
          {searchBar}
        </LinearGradient>

        {/* Scrollable page content */}
        <View>
          {/* Store Status Card — temporarily hidden
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusTitle}>We will next open</Text>
            <Text style={styles.statusTime}>at 8 am</Text>
            <Text style={styles.statusSubtext}>
              You can still add items and{"\n"}order when the store re-opens
            </Text>
          </View>
          <View style={styles.closedBadge}>
            <View style={styles.closedBadgeInner}>
              <Text style={styles.closedText}>Sorry, we are</Text>
              <Text style={styles.closedTextBold}>CLOSED</Text>
            </View>
          </View>
        </View>
        */}

        {/* Ration Kits Banner */}
        <TouchableOpacity
          style={styles.rationKitsBanner}
          activeOpacity={0.85}
          onPress={onRationKitsPress}
        >
          <LinearGradient
            colors={['#7C3AED', '#5B2D8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rationKitsGradient}
          >
            <View style={styles.rationKitsContent}>
              <View style={styles.rationKitsLeft}>
                <View style={styles.rationKitsBadge}>
                  <MaterialCommunityIcons name="tag" size={12} color="#FFD700" />
                  <Text style={styles.rationKitsBadgeText}>  SAVE UP TO ₹700</Text>
                </View>
                <Text style={styles.rationKitsTitle}>Monthly Ration Kits</Text>
                <Text style={styles.rationKitsSubtitle}>
                  Complete grocery sets for your family
                </Text>
                <View style={styles.rationKitsViewBtn}>
                  <Text style={styles.rationKitsViewText}>View Kits</Text>
                  <MaterialCommunityIcons name="arrow-right" size={14} color="#fff" />
                </View>
              </View>
              <View style={styles.rationKitsRight}>
                <Text style={styles.rationKitsEmoji}>🛒</Text>
                <Text style={styles.rationKitsSizes}>3 • 5 • 7 • 10</Text>
                <Text style={styles.rationKitsSizesLabel}>Members</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <>
            {/* All Categories from API */}
            <View style={[styles.section, { marginTop: 16 }]}>
              <Text style={styles.sectionTitle}>Categories</Text>
              {isLoading ? (
                <CategoryShimmer />
              ) : categories.length > 0 ? (
                <View style={styles.categoryGrid}>
                  {categories.map((category) => (
                    <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={() => onCategoryPress?.(category.apiName)}>
                      <View style={[styles.categoryIconBox, { backgroundColor: category.bgColor }]}>
                        <Image source={category.image} style={styles.categoryImage} resizeMode="cover" />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
        </>

          {/* Rotana Store footer */}
          <View style={styles.footerBrand}>
            <Text style={styles.footerBrandText}>Rotana Store</Text>
          </View>
        </View>
      </ScrollView>

      {/* Absolute sticky search bar — appears only after header scrolls away */}
      {stickyVisible && (
        <View style={[styles.stickySearch, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
          {searchBar}
        </View>
      )}



      {/* Address Bottom Sheet */}
      <Modal
        visible={addressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setAddressModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.handleBar} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Address</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color="#555" />
              </TouchableOpacity>
            </View>
            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressRow, selectedAddressId === addr.id && styles.addressRowActive]}
                onPress={() => {
                  dispatch(selectAddress(addr.id));
                  setAddressModalVisible(false);
                }}
                activeOpacity={0.75}
              >
                <View style={[styles.addrIconBox, selectedAddressId === addr.id && styles.addrIconBoxActive]}>
                  <MaterialCommunityIcons
                    name={addr.label.toLowerCase().includes('home') ? 'home-outline' : 'briefcase-outline'}
                    size={20}
                    color={selectedAddressId === addr.id ? '#0C831F' : '#888'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addrType}>{addr.label}</Text>
                  <Text style={styles.addrLine} numberOfLines={1}>{addr.line1}</Text>
                  <Text style={styles.addrCity}>{addr.city}, {addr.state} - {addr.pincode}</Text>
                </View>
                {selectedAddressId === addr.id && (
                  <MaterialCommunityIcons name="check-circle" size={20} color="#0C831F" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addAddressBtn}
              activeOpacity={0.8}
              onPress={() => {
                setAddressModalVisible(false);
                onAddAddressPress?.();
              }}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#0C831F" />
              <Text style={styles.addAddressText}> Add New Address</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  stickySearch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#5B2D8E',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  deliveryTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    flex: 1,
  },
  dropdownIcon: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  searchHintClip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 20,
  },
  searchHintStatic: {
    fontSize: 14,
    color: '#888',
  },
  searchTickerBox: {
    height: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  searchHintProduct: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusSubtext: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 16,
  },
  closedBadge: {
    backgroundColor: '#FF4D6D',
    borderRadius: 12,
    padding: 3,
    transform: [{ rotate: '5deg' }],
  },
  closedBadgeInner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closedText: {
    fontSize: 12,
    color: '#fff',
  },
  closedTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: '25%',
    padding: 8,
    alignItems: 'center',
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  categoryName: {
    fontSize:10,
    color: '#333',
    textAlign: 'center',
    lineHeight: 13,
  },
  productCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImagePlaceholder: {
    fontSize: 48,
  },
  addButton: {
    position: 'absolute',
    top: 96,
    right: 8,
    backgroundColor: '#0C831F',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productWeight: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  productBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  footerBrand: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  footerBrandText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#c8c8c8',
    letterSpacing: 10,
    opacity: 0.45,
    textTransform: 'uppercase',
  },
  // Address modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  addressRowActive:    { backgroundColor: '#F1FAF3' },
  addrIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addrIconBoxActive:   { backgroundColor: '#E8F5E9' },
  addrType:            { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 2 },
  addrLine:            { fontSize: 12, color: '#555' },
  addrCity:            { fontSize: 11, color: '#888', marginTop: 2 },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#0C831F',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  addAddressText: { fontSize: 14, fontWeight: '600', color: '#0C831F' },

  // Ration Kits Banner
  rationKitsBanner: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  rationKitsGradient: {
    padding: 16,
  },
  rationKitsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rationKitsLeft: {
    flex: 1,
  },
  rationKitsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  rationKitsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  rationKitsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  rationKitsSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 10,
  },
  rationKitsViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rationKitsViewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    marginRight: 4,
  },
  rationKitsRight: {
    alignItems: 'center',
    marginLeft: 12,
  },
  rationKitsEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  rationKitsSizes: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
  },
  rationKitsSizesLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
});
