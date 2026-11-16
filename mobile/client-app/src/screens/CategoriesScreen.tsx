import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';
import { getCategoryImage, getCategoryDisplayName } from '../utils/categoryImages';

interface Props {
  onCategoryPress?: (name: string) => void;
  onGoBack?: () => void;
}

export default function CategoriesScreen({ onCategoryPress, onGoBack }: Props) {
  const { categories: apiCategories } = useAppSelector((state) => state.categories);

  // Filter to only show parent categories (no parentId)
  const parentCategories = apiCategories.filter(cat => !cat.parentId);
  const subCategories = apiCategories.filter(cat => cat.parentId);

  console.log('[CATEGORIES_SCREEN] Display info:', {
    total: apiCategories.length,
    parents: parentCategories.length,
    children: subCategories.length,
  });

  // Transform API categories to display format
  const displayCategories = parentCategories
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
        name: displayName,
        apiName: apiCat.name,
        image,
        bg: bgColor,
        isFromApi: !!apiCat.imageUrl,
      };
    });

  const groups = displayCategories.length > 0
    ? [{ title: 'All Categories', items: displayCategories }]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.grid}>
              {group.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.75}
                  onPress={() => onCategoryPress?.(item.apiName)}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                    <Image source={item.image} style={styles.catImage} resizeMode="cover" />
                  </View>
                  <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 24 }} />
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
  group: { backgroundColor: '#fff', marginTop: 10, paddingBottom: 8 },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  card: { width: '33.3333%', padding: 8, alignItems: 'center' },
  iconBox: {
    width: 62,
    height: 62,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catImage: { width: '100%', height: '100%', borderRadius: 14 },
  name: { fontSize: 10, color: '#333', textAlign: 'center', lineHeight: 13 },
});
