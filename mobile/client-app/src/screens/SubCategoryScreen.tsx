import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductsByCategory } from '../store/slices/productsSlice';
import { Product as ApiProduct } from '../services/ProductsService';
import { formatProductForDisplay, FormattedProduct } from '../utils/productFormatter';
import AddButton from '../components/AddButton';

const BG_COLORS = [
  '#FFF3E0', '#E8F5E9', '#E3F2FD', '#FCE4EC',
  '#F3E5F5', '#FFF9C4', '#FFEBEE', '#E0F7FA',
];
function getBg(subCatId: number) { return BG_COLORS[subCatId % BG_COLORS.length]; }

const SORT_OPTIONS = [
  'Relevance',
  'Price: Low to High',
  'Price: High to Low',
  'Rating',
  'Discount',
];

const FILTER_BRANDS = ['Amul', 'Tata', 'Nestle', 'Patanjali', 'Britannia', 'MDH'];
const FILTER_DISCOUNTS = ['10% and above', '20% and above', '30% and above'];
const FILTER_PRICES = ['Under ₹50', '₹50 – ₹200', 'Above ₹200'];


interface Props {
  categoryName?: string;
  onGoBack: () => void;
  onSearchPress?: () => void;
  onProductPress?: (product: ApiProduct) => void;
  cartState: Record<string, number>;
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function SubCatIcon({ icon, lib, size, color }: { icon: string; lib: 'mci' | 'ion'; size: number; color: string }) {
  if (lib === 'ion') return <Ionicons name={icon as any} size={size} color={color} />;
  return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
}

// ── Star row ──────────────────────────────────────────────────────────────────

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons
          key={i}
          name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half-full' : 'star-outline'}
          size={11}
          color="#F0A050"
        />
      ))}
    </View>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  qty,
  onAdd,
  onRemove,
  onPress,
}: {
  product: FormattedProduct;
  qty: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onPress?: () => void;
}) {
  const bgColor = BG_COLORS[Math.random() * BG_COLORS.length | 0];
  const [imgErr, setImgErr] = useState(false);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onPress}>
      <View style={[styles.imageArea, { backgroundColor: bgColor }]}>
        {imgErr || !product.imageUrl ? (
          <View style={styles.imgIconCircle}>
            <MaterialCommunityIcons name="package-variant-closed" size={44} color="#555" />
          </View>
        ) : (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImg}
            resizeMode="cover"
            onError={() => setImgErr(true)}
          />
        )}
        {product.discount > 0 && (
          <View style={styles.discBadge}>
            <Text style={styles.discBadgeText}>{product.discount}%</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishlistBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="heart-outline" size={18} color="#bbb" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.weightRow}>
          <View style={styles.greenDot} />
          <Text style={styles.weightText}>{product.weight}</Text>
        </View>

        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.brandText}>{product.brand}</Text>

        {product.isOutOfStock && (
          <Text style={styles.stockText}>Out of Stock</Text>
        )}
        {!product.isOutOfStock && product.stock <= 5 && (
          <Text style={styles.stockText}>Only {product.stock} left</Text>
        )}

        {product.discount > 0 && (
          <Text style={styles.discountText}>{product.discount}% OFF</Text>
        )}

        <View style={styles.priceAddRow}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <View style={styles.priceRow}>
              <Text style={styles.price} numberOfLines={1}>₹{product.price}</Text>
              <Text style={styles.mrp} numberOfLines={1}> MRP ₹{product.mrp}</Text>
            </View>
          </View>
          <AddButton
            productId={product.variantId}
            quantity={qty}
            onAdd={onAdd}
            onRemove={onRemove}
            size="sm"
            disabled={product.isOutOfStock}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function SubCategoryScreen({
  categoryName = 'Staples & Grains',
  onGoBack,
  onSearchPress,
  onProductPress,
  cartState,
  onAddToCart,
  onRemoveFromCart,
}: Props) {
  const dispatch = useAppDispatch();
  const { products: apiProducts, isLoading: productsLoading } = useAppSelector((state) => state.products);
  const { categories: apiCategories } = useAppSelector((state) => state.categories);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  // Find parent category and extract subcategories from flat list
  const parentCategory = apiCategories.find((cat) => cat.name === categoryName);
  const parentCategoryId = parentCategory?.id;

  // Extract all sub-categories that have this parent (using parentId field)
  const subCategories = parentCategoryId
    ? apiCategories.filter((cat) => cat.parentId === parentCategoryId)
    : [];

  // Fetch products for this category when component mounts or category changes
  useEffect(() => {
    console.log('[SUBCATEGORY] Mount:', { categoryName, parentCategoryId, categoriesCount: apiCategories.length });

    if (!parentCategoryId) {
      console.warn('[SUBCATEGORY] parentCategoryId is undefined! Categories available:', apiCategories.map(c => ({ name: c.name, id: c.id })));
      return;
    }

    const subCategoryIds = subCategories.map((s) => s.id);
    const allCategoryIds = [parentCategoryId, ...subCategoryIds];

    console.log('[SUBCATEGORY] Fetching products for category:', categoryName, 'IDs:', allCategoryIds);
    dispatch(fetchProductsByCategory(allCategoryIds));
  }, [parentCategoryId, categoryName, dispatch, apiCategories, subCategories.length]);

  // Get all valid category names for this parent (main category + all sub-categories)
  const validCategoryNames = new Set<string>();
  if (parentCategory) validCategoryNames.add(parentCategory.name);
  subCategories.forEach(sub => validCategoryNames.add(sub.name));

  // Filter products by matching any of the valid category names
  const filteredProducts = apiProducts
    .filter((p) => validCategoryNames.has(p.category?.name || ''))
    .filter((p) => {
      // If a subcategory is selected, filter by it specifically
      if (selectedSubCategory) {
        return p.category?.name === selectedSubCategory;
      }
      return true;
    })
    .map((p) => formatProductForDisplay(p))
    .filter((p) => p !== null) as FormattedProduct[];

  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Relevance');
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [activeDisc, setActiveDisc] = useState<string[]>([]);
  const [activePrice, setActivePrice] = useState<string[]>([]);

  const toggleBrand = (b: string) => setActiveBrands((prev) => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleDisc = (d: string) => setActiveDisc((prev) => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const togglePrice = (p: string) => setActivePrice((prev) => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const totalActive = activeBrands.length + activeDisc.length + activePrice.length;

  // Create rows for 2-column layout
  const rows: FormattedProduct[][] = [];
  for (let i = 0; i < filteredProducts.length; i += 2) {
    rows.push(filteredProducts.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onGoBack} activeOpacity={0.7}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>

          <View style={styles.titleArea}>
            <Text style={styles.headerTitle} numberOfLines={1}>{categoryName}</Text>
            <View style={styles.deliveryToRow}>
              <Text style={styles.deliveryToLabel}>Delivering to : </Text>
              <Text style={styles.deliveryToVal}>Venkat Nagar, Ba...</Text>
              <MaterialCommunityIcons name="chevron-down" size={14} color="#5B2D8E" />
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={onSearchPress}>
              <MaterialCommunityIcons name="magnify" size={18} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter bar */}
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[styles.filterBtn, totalActive > 0 && styles.filterBtnActive]}
            activeOpacity={0.7}
            onPress={() => setFilterVisible(true)}
          >
            <MaterialCommunityIcons name="tune-variant" size={13} color={totalActive > 0 ? '#5B2D8E' : '#555'} />
            <Text style={[styles.filterBtnText, totalActive > 0 && styles.filterBtnTextActive]}>
              {' '}Filters{totalActive > 0 ? ` (${totalActive})` : ''}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={12} color={totalActive > 0 ? '#5B2D8E' : '#555'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterBtn, selectedSort !== 'Relevance' && styles.filterBtnActive]}
            activeOpacity={0.7}
            onPress={() => setSortVisible(true)}
          >
            <MaterialCommunityIcons name="sort-ascending" size={13} color={selectedSort !== 'Relevance' ? '#5B2D8E' : '#555'} />
            <Text style={[styles.filterBtnText, selectedSort !== 'Relevance' && styles.filterBtnTextActive]}>
              {' '}{selectedSort === 'Relevance' ? 'Sort' : selectedSort.split(':')[0]}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={12} color={selectedSort !== 'Relevance' ? '#5B2D8E' : '#555'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        {/* Sidebar with subcategories */}
        {subCategories.length > 0 && (
          <View style={styles.sidebarWrapper}>
            <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
              {/* "All" option */}
              <TouchableOpacity
                style={[styles.sidebarItem, selectedSubCategory === null && styles.sidebarItemActive]}
                onPress={() => setSelectedSubCategory(null)}
                activeOpacity={0.7}
              >
                {selectedSubCategory === null && <View style={styles.activeBar} />}
                <View style={[styles.iconCircle, selectedSubCategory === null && styles.iconCircleActive]}>
                  <MaterialCommunityIcons
                    name="dots-grid"
                    size={20}
                    color={selectedSubCategory === null ? '#5B2D8E' : '#777'}
                  />
                </View>
                <Text
                  style={[
                    styles.sidebarLabel,
                    selectedSubCategory === null && styles.sidebarLabelActive,
                  ]}
                  numberOfLines={2}
                >
                  All
                </Text>
              </TouchableOpacity>

              {/* Subcategories */}
              {subCategories.map((subCat, idx) => {
                const isActive = selectedSubCategory === subCat.name;
                const hasImage = typeof subCat.imageUrl === 'string' && subCat.imageUrl.trim().length > 0;
                return (
                  <TouchableOpacity
                    key={subCat.id}
                    style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                    onPress={() => setSelectedSubCategory(subCat.name)}
                    activeOpacity={0.7}
                  >
                    {isActive && <View style={styles.activeBar} />}
                    <View
                      style={[
                        styles.iconCircle,
                        isActive && styles.iconCircleActive,
                        !hasImage && { backgroundColor: BG_COLORS[idx % BG_COLORS.length], borderWidth: 0 },
                      ]}
                    >
                      {hasImage ? (
                        <Image
                          source={{ uri: subCat.imageUrl as string }}
                          style={{ width: 44, height: 44, borderRadius: 22 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#555' }}>
                          {subCat.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.sidebarLabel,
                        isActive && styles.sidebarLabelActive,
                      ]}
                      numberOfLines={2}
                    >
                      {subCat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Product grid */}
        <ScrollView
          style={styles.productList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productListContent}
        >
          {productsLoading ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="loading" size={48} color="#5B2D8E" />
              <Text style={styles.emptyText}>Loading products...</Text>
            </View>
          ) : rows.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="package-variant" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No products available</Text>
            </View>
          ) : (
            rows.map((pair, idx) => (
              <View key={idx} style={styles.productRow}>
                {pair.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    qty={cartState[p.variantId] ?? 0}
                    onAdd={onAddToCart}
                    onRemove={onRemoveFromCart}
                    onPress={() => onProductPress?.(apiProducts.find(ap => ap.id === p.id)!)}
                  />
                ))}
                {pair.length === 1 && <View style={styles.cardPlaceholder} />}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* ── Sort Modal ── */}
      <Modal visible={sortVisible} transparent animationType="slide" onRequestClose={() => setSortVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSortVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => { }}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort By</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.sortRow}
                activeOpacity={0.7}
                onPress={() => { setSelectedSort(opt); setSortVisible(false); }}
              >
                <Text style={[styles.sortLabel, selectedSort === opt && styles.sortLabelActive]}>{opt}</Text>
                <MaterialCommunityIcons
                  name={selectedSort === opt ? 'radiobox-marked' : 'radiobox-blank'}
                  size={20}
                  color={selectedSort === opt ? '#5B2D8E' : '#ccc'}
                />
              </TouchableOpacity>
            ))}
            <View style={{ height: 16 }} />
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Filter Modal ── */}
      <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => { }}>
            <View style={styles.modalHandle} />
            <View style={styles.filterModalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => { setActiveBrands([]); setActiveDisc([]); setActivePrice([]); }}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterGroupLabel}>BRAND</Text>
              <View style={styles.chipRow}>
                {FILTER_BRANDS.map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.chip, activeBrands.includes(b) && styles.chipActive]}
                    onPress={() => toggleBrand(b)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, activeBrands.includes(b) && styles.chipTextActive]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.filterGroupLabel}>DISCOUNT</Text>
              <View style={styles.chipRow}>
                {FILTER_DISCOUNTS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, activeDisc.includes(d) && styles.chipActive]}
                    onPress={() => toggleDisc(d)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, activeDisc.includes(d) && styles.chipTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.filterGroupLabel}>PRICE</Text>
              <View style={styles.chipRow}>
                {FILTER_PRICES.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.chip, activePrice.includes(p) && styles.chipActive]}
                    onPress={() => togglePrice(p)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, activePrice.includes(p) && styles.chipTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.applyBtn} activeOpacity={0.85} onPress={() => setFilterVisible(false)}>
              <Text style={styles.applyBtnText}>Apply Filters{totalActive > 0 ? ` (${totalActive})` : ''}</Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 6,
  },
  backBtn: { padding: 4 },
  titleArea: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  deliveryToRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  deliveryToLabel: { fontSize: 11, color: '#555' },
  deliveryToVal: { fontSize: 11, color: '#0C831F', fontWeight: '600' },
  headerIcons: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 34, height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Filter bar
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  filterBtnText: { fontSize: 11, color: '#444', fontWeight: '500' },
  filterBtnActive: { borderColor: '#5B2D8E', backgroundColor: '#F3E5F5' },
  filterBtnTextActive: { color: '#5B2D8E', fontWeight: '700' },

  // Body
  body: { flex: 1, flexDirection: 'row', backgroundColor: '#f5f5f5' },

  // Sidebar
  sidebarWrapper: {
    width: '22%',
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  sidebar: { flex: 1 },
  sidebarItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    position: 'relative',
  },
  sidebarItemActive: { backgroundColor: '#fff' },
  activeBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    backgroundColor: '#5B2D8E',
    borderRadius: 2,
  },
  iconCircle: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    overflow: 'hidden',
  },
  iconCircleActive: { borderColor: '#5B2D8E', borderWidth: 2 },
  sidebarLabel: { fontSize: 9, color: '#777', textAlign: 'center', lineHeight: 13 },
  sidebarLabelActive: { color: '#111', fontWeight: '700' },

  // Product grid
  productList: { flex: 1 },
  productListContent: { padding: 6, paddingBottom: 24 },
  productRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },

  // Card
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  cardPlaceholder: { flex: 1 },
  imageArea: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'hidden',
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
  imgIconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center', alignItems: 'center',
  },
  discBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: '#2874F0', borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  discBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  wishlistBtn: { position: 'absolute', top: 8, right: 8 },
  priceAddRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  cardContent: { padding: 7 },
  weightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  greenDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#0C831F', marginRight: 4 },
  weightText: { fontSize: 10, color: '#0C831F', fontWeight: '600' },
  productName: { fontSize: 11, fontWeight: '700', color: '#1a1a1a', lineHeight: 15, marginBottom: 1 },
  brandText: { fontSize: 10, color: '#888', marginBottom: 3 },
  starsRow: { flexDirection: 'row', marginBottom: 1 },
  reviewCount: { fontSize: 9, color: '#888', marginBottom: 3 },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  deliveryText: { fontSize: 10, color: '#0C831F', fontWeight: '600' },
  stockText: { fontSize: 10, color: '#FF6B00', fontWeight: '600', marginBottom: 2 },
  discountText: { fontSize: 10, color: '#2874F0', fontWeight: '700', marginBottom: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 1 },
  price: { fontSize: 13, fontWeight: '800', color: '#111' },
  mrp: { fontSize: 10, color: '#999', textDecorationLine: 'line-through', marginLeft: 3 },
  priceUnit: { fontSize: 9, color: '#999' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: '#aaa', marginTop: 10 },

  // Modals
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    paddingHorizontal: 20, paddingTop: 12,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#ddd', alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#111', marginBottom: 12 },
  sortRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  sortLabel: { fontSize: 14, color: '#444' },
  sortLabelActive: { color: '#5B2D8E', fontWeight: '700' },
  filterModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  clearText: { fontSize: 13, color: '#D32F2F', fontWeight: '600' },
  filterGroupLabel: {
    fontSize: 11, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginTop: 14, marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#fff',
  },
  chipActive: { borderColor: '#5B2D8E', backgroundColor: '#F3E5F5' },
  chipText: { fontSize: 12, color: '#444' },
  chipTextActive: { color: '#5B2D8E', fontWeight: '700' },
  applyBtn: {
    backgroundColor: '#5B2D8E', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 16,
  },
  applyBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
