import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  onGoBack: () => void;
  onCategoryPress?: (name: string) => void;
}

const DUMMY_PRODUCTS = [
  { id: 's1',  name: 'Amul Butter',           brand: 'Amul',       weight: '500 g', price: 275, emoji: '🧈',  category: 'Dairy, Bread & Eggs'   },
  { id: 's2',  name: 'Whole Wheat Bread',      brand: "Modern's",   weight: '400 g', price: 42,  emoji: '🍞',  category: 'Dairy, Bread & Eggs'   },
  { id: 's3',  name: 'Farm Fresh Milk',        brand: 'Heritage',   weight: '1 L',   price: 62,  emoji: '🥛',  category: 'Dairy, Bread & Eggs'   },
  { id: 's4',  name: 'Sunflower Oil',          brand: 'Saffola',    weight: '1 L',   price: 149, emoji: '🫙',  category: 'Oil & Masala'           },
  { id: 's5',  name: 'Tata Salt',              brand: 'Tata',       weight: '1 kg',  price: 22,  emoji: '🧂',  category: 'Oil & Masala'           },
  { id: 's6',  name: 'MDH Chilli Powder',      brand: 'MDH',        weight: '100 g', price: 54,  emoji: '🌶️',  category: 'Oil & Masala'           },
  { id: 's7',  name: 'Kurkure Masala Munch',   brand: 'Kurkure',    weight: '90 g',  price: 20,  emoji: '🍟',  category: 'Chips & Namkeen'        },
  { id: 's8',  name: 'Lays Classic Salted',    brand: 'Lays',       weight: '45 g',  price: 20,  emoji: '🥔',  category: 'Chips & Namkeen'        },
  { id: 's9',  name: 'Maggi 2-Minute Noodles', brand: 'Maggi',      weight: '70 g',  price: 14,  emoji: '🍜',  category: 'Instant Food'           },
  { id: 's10', name: 'Oreo Biscuits',          brand: 'Oreo',       weight: '120 g', price: 32,  emoji: '🍪',  category: 'Bakery & Biscuits'      },
  { id: 's11', name: 'Amul Dark Chocolate',    brand: 'Amul',       weight: '150 g', price: 99,  emoji: '🍫',  category: 'Sweets & Chocolates'    },
  { id: 's12', name: 'Tropicana Orange Juice', brand: 'Tropicana',  weight: '1 L',   price: 130, emoji: '🧃',  category: 'Drinks & Juices'        },
  { id: 's13', name: 'Basmati Rice',           brand: 'India Gate', weight: '5 kg',  price: 399, emoji: '🍚',  category: 'Atta, Rice & Dal'       },
  { id: 's14', name: 'Whole Wheat Atta',       brand: 'Aashirvaad', weight: '5 kg',  price: 259, emoji: '🌾',  category: 'Atta, Rice & Dal'       },
  { id: 's15', name: 'Eggs (12 pcs)',          brand: 'Nandus',     weight: '12 pcs',price: 84,  emoji: '🥚',  category: 'Dairy, Bread & Eggs'   },
];

const POPULAR_SEARCHES = ['Milk', 'Bread', 'Eggs', 'Chicken', 'Atta', 'Oil', 'Biscuits', 'Juice'];

export default function SearchScreen({ onGoBack, onCategoryPress }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const results = query.trim().length > 0
    ? DUMMY_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  const isSearching = query.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Search header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.inputBox}>
          <MaterialCommunityIcons name="magnify" size={18} color="#999" />
          <TextInput
            ref={inputRef}
            autoFocus
            style={styles.input}
            placeholder="Search for products, brands..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close-circle" size={16} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isSearching ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.tagsRow}>
              {POPULAR_SEARCHES.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  activeOpacity={0.75}
                  onPress={() => setQuery(tag)}
                >
                  <MaterialCommunityIcons name="magnify" size={13} color="#666" />
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.noResults}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={52} color="#ccc" />
            <Text style={styles.noResultsTitle}>No results for "{query}"</Text>
            <Text style={styles.noResultsSub}>Try different keywords</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{results.length} result{results.length > 1 ? 's' : ''} for "{query}"</Text>
            {results.map((product) => (
              <View key={product.id} style={styles.resultCard}>
                <View style={styles.resultImg}>
                  <Text style={styles.resultEmoji}>{product.emoji}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{product.name}</Text>
                  <Text style={styles.resultBrand}>{product.brand} • {product.weight}</Text>
                  <Text style={styles.resultCat}>{product.category}</Text>
                </View>
                <View style={styles.resultRight}>
                  <Text style={styles.resultPrice}>₹{product.price}</Text>
                  <TouchableOpacity style={styles.addCircle} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  backBtn: { padding: 4 },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 6,
  },
  input: { flex: 1, fontSize: 15, color: '#111' },
  scroll: { flex: 1 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  tagText: { fontSize: 13, color: '#555' },
  noResults:      { alignItems: 'center', paddingTop: 60 },
  noResultsTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginTop: 14 },
  noResultsSub:   { fontSize: 13, color: '#888', marginTop: 6 },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  resultImg: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultEmoji:  { fontSize: 26 },
  resultInfo:   { flex: 1 },
  resultName:   { fontSize: 13, fontWeight: '700', color: '#111' },
  resultBrand:  { fontSize: 11, color: '#888', marginTop: 2 },
  resultCat:    { fontSize: 10, color: '#0C831F', marginTop: 2 },
  resultRight:  { alignItems: 'center', gap: 8 },
  resultPrice:  { fontSize: 14, fontWeight: '800', color: '#111' },
  addCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0C831F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
