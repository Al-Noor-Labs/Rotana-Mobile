import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { getDataForCategory, getProductImage, Product, SubCat } from '../data/categoryData';
import AddButton from '../components/AddButton';

const BG_COLORS = [
  '#FFF3E0', '#E8F5E9', '#E3F2FD', '#FCE4EC',
  '#F3E5F5', '#FFF9C4', '#FFEBEE', '#E0F7FA',
];

function getBg(subCatId: number) {
  return BG_COLORS[subCatId % BG_COLORS.length];
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons
          key={i}
          name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half-full' : 'star-outline'}
          size={16}
          color="#F0A050"
        />
      ))}
      <Text style={styles.ratingNum}> {rating}</Text>
    </View>
  );
}

interface Props {
  product: Product;
  categoryName: string;
  cartState: Record<string, number>;
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
  onGoBack: () => void;
}

const DUMMY_DESC = [
  'Premium quality product sourced directly from trusted manufacturers.',
  'Meets all FSSAI quality standards and certifications.',
  '100% natural ingredients, no artificial additives or preservatives.',
  'Resealable packaging to maintain freshness after opening.',
  'Best consumed before the date printed on the package.',
];

const HIGHLIGHTS = [
  { icon: 'truck-fast-outline',     text: 'Delivered in 12 mins'     },
  { icon: 'shield-check-outline',   text: 'Quality Guaranteed'       },
  { icon: 'cash-refund',            text: 'Easy Returns in 24 hrs'   },
  { icon: 'leaf-circle-outline',    text: 'Freshness Assured'        },
];

function RelatedProductImage({ p, relSub }: { p: Product; relSub?: SubCat }) {
  const [err, setErr] = useState(false);
  if (!err) {
    return (
      <Image
        source={{ uri: getProductImage(p) }}
        style={styles.relatedImgPhoto}
        resizeMode="cover"
        onError={() => setErr(true)}
      />
    );
  }
  return relSub?.iconLib === 'ion'
    ? <Ionicons name={relSub.icon as any} size={36} color="#666" />
    : <MaterialCommunityIcons name={(relSub?.icon ?? 'package-variant-closed') as any} size={36} color="#666" />;
}

export default function ProductDetailScreen({
  product,
  categoryName,
  cartState,
  onAddToCart,
  onRemoveFromCart,
  onGoBack,
}: Props) {
  const { subs, products } = getDataForCategory(categoryName);
  const sub = subs.find((s: SubCat) => s.id === product.subCatId);
  const bgColor = getBg(product.subCatId);
  const qty = cartState[String(product.id)] ?? 0;
  const [wishlist, setWishlist] = useState(false);
  const [mainImgErr, setMainImgErr] = useState(false);

  const related = products
    .filter((p: Product) => p.subCatId === product.subCatId && p.id !== product.id)
    .slice(0, 6);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <TouchableOpacity onPress={() => setWishlist((w) => !w)} style={styles.wishBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name={wishlist ? 'heart' : 'heart-outline'} size={22} color={wishlist ? '#E53935' : '#555'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image area */}
        <View style={[styles.imageArea, { backgroundColor: bgColor }]}>
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{product.discount}% OFF</Text>
            </View>
          )}
          {mainImgErr ? (
            <View style={styles.iconCircle}>
              {sub?.iconLib === 'ion'
                ? <Ionicons name={sub.icon as any} size={64} color="#555" />
                : <MaterialCommunityIcons name={(sub?.icon ?? 'package-variant-closed') as any} size={64} color="#555" />
              }
            </View>
          ) : (
            <Image
              source={{ uri: getProductImage(product) }}
              style={styles.mainProductImg}
              resizeMode="cover"
              onError={() => setMainImgErr(true)}
            />
          )}
          <Text style={styles.weightBadge}>{product.weight}</Text>
        </View>

        {/* Product Info */}
        <View style={styles.infoCard}>
          <View style={styles.deliveryRowTop}>
            <MaterialCommunityIcons name="clock-fast" size={14} color="#0C831F" />
            <Text style={styles.deliveryText}> {product.delivery} delivery</Text>
            {product.stock <= 5 && (
              <View style={styles.stockBadge}>
                <Text style={styles.stockText}>Only {product.stock} left!</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brandText}>{product.brand}  ·  {product.weight}</Text>

          <View style={styles.ratingRow}>
            <StarRow rating={product.rating} />
            <Text style={styles.reviewsText}>  {product.reviews} ratings</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.mrp}>MRP ₹{product.mrp}</Text>
            <Text style={styles.unit}>{product.unit}</Text>
          </View>

          {/* Add to Cart */}
          <View style={styles.addRow}>
            <AddButton
              productId={String(product.id)}
              quantity={qty}
              onAdd={onAddToCart}
              onRemove={onRemoveFromCart}
              size="md"
            />
          </View>
        </View>

        {/* Highlights */}
        <View style={styles.highlightsCard}>
          <Text style={styles.sectionTitle}>Why shop from us</Text>
          <View style={styles.highlightsGrid}>
            {HIGHLIGHTS.map((h) => (
              <View key={h.text} style={styles.highlightItem}>
                <MaterialCommunityIcons name={h.icon as any} size={26} color="#0C831F" />
                <Text style={styles.highlightText}>{h.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          {DUMMY_DESC.map((d, i) => (
            <View key={i} style={styles.descRow}>
              <View style={styles.descDot} />
              <Text style={styles.descText}>{d}</Text>
            </View>
          ))}
          <View style={styles.specTable}>
            {[
              ['Brand', product.brand],
              ['Weight / Volume', product.weight],
              ['Price per unit', product.unit],
              ['Stock', `${product.stock} units available`],
            ].map(([k, v]) => (
              <View key={k} style={styles.specRow}>
                <Text style={styles.specKey}>{k}</Text>
                <Text style={styles.specVal}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Related products */}
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>More from this category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
              {related.map((p: Product) => {
                const relQty = cartState[String(p.id)] ?? 0;
                const relSub = subs.find((s: SubCat) => s.id === p.subCatId);
                return (
                  <View key={p.id} style={styles.relatedCard}>
                    <View style={[styles.relatedImg, { backgroundColor: getBg(p.subCatId) }]}>
                      <RelatedProductImage p={p} relSub={relSub} />
                      {p.discount > 0 && (
                        <View style={styles.relatedDiscBadge}>
                          <Text style={styles.relatedDiscText}>{p.discount}%</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.relatedInfo}>
                      <Text style={styles.relatedName} numberOfLines={2}>{p.name}</Text>
                      <Text style={styles.relatedWeight}>{p.weight}</Text>
                      <Text style={styles.relatedPrice}>₹{p.price}</Text>
                      <AddButton
                        productId={String(p.id)}
                        quantity={relQty}
                        onAdd={onAddToCart}
                        onRemove={onRemoveFromCart}
                        size="sm"
                      />
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 2,
  },
  backBtn: { marginRight: 12, padding: 2 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111' },
  wishBtn: { padding: 4 },

  scroll: { flex: 1 },

  imageArea: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mainProductImg: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: '#2874F0', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  discountBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center', alignItems: 'center',
  },
  weightBadge: {
    position: 'absolute', bottom: 14, right: 14,
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    fontSize: 12, color: '#333', fontWeight: '600',
  },

  infoCard: {
    backgroundColor: '#fff', padding: 16, marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  deliveryRowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  deliveryText: { fontSize: 13, color: '#0C831F', fontWeight: '600' },
  stockBadge: {
    marginLeft: 'auto', backgroundColor: '#FFF3E0',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3,
  },
  stockText: { fontSize: 11, color: '#FF6B00', fontWeight: '700' },
  productName: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 4, lineHeight: 26 },
  brandText: { fontSize: 13, color: '#777', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  ratingNum: { fontSize: 14, fontWeight: '700', color: '#F0A050' },
  reviewsText: { fontSize: 12, color: '#888' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 14 },
  price: { fontSize: 24, fontWeight: '900', color: '#111' },
  mrp: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  unit: { fontSize: 12, color: '#888' },
  addRow: { alignItems: 'flex-start' },

  highlightsCard: {
    backgroundColor: '#fff', padding: 16, marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 12 },
  highlightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  highlightItem: { width: '45%', flexDirection: 'row', alignItems: 'center', gap: 8 },
  highlightText: { fontSize: 12, color: '#444', flex: 1, lineHeight: 17 },

  descCard: {
    backgroundColor: '#fff', padding: 16, marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  descRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  descDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0C831F', marginTop: 6, marginRight: 8, flexShrink: 0 },
  descText: { fontSize: 13, color: '#444', lineHeight: 20, flex: 1 },
  specTable: { marginTop: 12, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  specRow: {
    flexDirection: 'row', backgroundColor: '#fff', padding: 11,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  specKey: { fontSize: 12, color: '#888', width: 130 },
  specVal: { fontSize: 12, color: '#111', fontWeight: '600', flex: 1 },

  relatedSection: {
    backgroundColor: '#fff', padding: 16, marginBottom: 8,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3,
  },
  relatedScroll: { gap: 12, paddingRight: 8 },
  relatedCard: {
    width: 130, backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#eee', overflow: 'hidden',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2,
  },
  relatedImg: {
    height: 90, justifyContent: 'center', alignItems: 'center', position: 'relative',
    overflow: 'hidden',
  },
  relatedImgPhoto: {
    width: '100%',
    height: '100%',
  },
  relatedDiscBadge: {
    position: 'absolute', top: 5, right: 5,
    backgroundColor: '#2874F0', borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  relatedDiscText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  relatedInfo: { padding: 8 },
  relatedName: { fontSize: 11, fontWeight: '700', color: '#111', lineHeight: 15, marginBottom: 3 },
  relatedWeight: { fontSize: 10, color: '#888', marginBottom: 4 },
  relatedPrice: { fontSize: 13, fontWeight: '800', color: '#111', marginBottom: 6 },
});
