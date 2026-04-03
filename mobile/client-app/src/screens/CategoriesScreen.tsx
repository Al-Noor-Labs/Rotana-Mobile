import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CAT_IMGS = {
  attaRice:    require('../../assets/Categories Images/Atta, Rice and Dal.png'),
  dryFruits:   require('../../assets/Categories Images/Dryfruit and Cerels.png'),
  dairy:       require('../../assets/Categories Images/Dairy, Bread and Eggs.png'),
  bakery:      require('../../assets/Categories Images/Bakery.png'),
  oilMasala:   require('../../assets/Categories Images/Oil and Masala.png'),
  kitchenware: require('../../assets/Categories Images/Home and Life Style.png'),
  fruitsVeg:   require('../../assets/Categories Images/Fruits and Vegetables.png'),
  chicken:     require('../../assets/Categories Images/Chicken, Meath and Fish.png'),
  teaCoffee:   require('../../assets/Categories Images/Tea and Coffee.png'),
  sweets:      require('../../assets/Categories Images/Sweets and Chocolates.png'),
  drinks:      require('../../assets/Categories Images/Drinks and Juices.png'),
  chips:       require('../../assets/Categories Images/Chips and Namkeens.png'),
  sauces:      require('../../assets/Categories Images/Sauces and Spreads.png'),
  panCorner:   require('../../assets/Categories Images/Pan Corner.png'),
  instantFood: require('../../assets/Categories Images/Instant Food.png'),
  iceCreams:   require('../../assets/Categories Images/Ice Creams and More Ctg.png'),
  skinFace:    require('../../assets/Categories Images/Skin and Face Care.png'),
  hairCare:    require('../../assets/Categories Images/Hair Care.png'),
  femHygiene:  require('../../assets/Categories Images/Feminine Hydene.png'),
  bathBody:    require('../../assets/Categories Images/Bath and Body.png'),
  stationary:  require('../../assets/Categories Images/Stationary and Games.png'),
  electronics: require('../../assets/Categories Images/Electronics.png'),
  cleaners:    require('../../assets/Categories Images/Cleaner and Repelleant.png'),
  toys:        require('../../assets/Categories Images/Toystore.png'),
};

interface Props {
  onCategoryPress?: (name: string) => void;
  onGoBack?: () => void;
}

const ALL_GROUPS = [
  {
    title: 'Groceries & Kitchen',
    items: [
      { id: 1,  name: 'Atta, Rice & Dal',        image: CAT_IMGS.attaRice,    bg: '#FFF3E0' },
      { id: 2,  name: 'Dry Fruits & Cereals',     image: CAT_IMGS.dryFruits,   bg: '#FFE0E0' },
      { id: 3,  name: 'Dairy, Bread & Eggs',      image: CAT_IMGS.dairy,       bg: '#E3F2FD' },
      { id: 4,  name: 'Bakery & Biscuits',        image: CAT_IMGS.bakery,      bg: '#FFF9C4' },
      { id: 5,  name: 'Oil & Masala',             image: CAT_IMGS.oilMasala,   bg: '#FFE0E0' },
      { id: 6,  name: 'Kitchenware & Appliances', image: CAT_IMGS.kitchenware, bg: '#F3E5F5' },
      { id: 7,  name: 'Fruits & Vegetables',      image: CAT_IMGS.fruitsVeg,   bg: '#E8F5E9' },
      { id: 8,  name: 'Chicken, Meat & Fish',     image: CAT_IMGS.chicken,     bg: '#FFEBEE' },
    ],
  },
  {
    title: 'Snacks & Drinks',
    items: [
      { id: 9,  name: 'Tea & Coffee',        image: CAT_IMGS.teaCoffee,   bg: '#FFF3E0' },
      { id: 10, name: 'Sweets & Chocolates', image: CAT_IMGS.sweets,      bg: '#FFE0E0' },
      { id: 11, name: 'Drinks & Juices',     image: CAT_IMGS.drinks,      bg: '#E3F2FD' },
      { id: 12, name: 'Chips & Namkeen',     image: CAT_IMGS.chips,       bg: '#FFEBEE' },
      { id: 13, name: 'Sauces & Spreads',    image: CAT_IMGS.sauces,      bg: '#FFF9C4' },
      { id: 14, name: 'Pan Corner',          image: CAT_IMGS.panCorner,   bg: '#E8F5E9' },
      { id: 15, name: 'Instant Food',        image: CAT_IMGS.instantFood, bg: '#FFF3E0' },
      { id: 16, name: 'Ice Creams & More',   image: CAT_IMGS.iceCreams,   bg: '#E1F5FE' },
    ],
  },
  {
    title: 'Beauty & Personal Care',
    items: [
      { id: 17, name: 'Skin & Face',       image: CAT_IMGS.skinFace,   bg: '#FCE4EC' },
      { id: 18, name: 'Hair Care',         image: CAT_IMGS.hairCare,   bg: '#F3E5F5' },
      { id: 19, name: 'Feminine Hygiene',  image: CAT_IMGS.femHygiene, bg: '#FFE0E0' },
      { id: 20, name: 'Bath & Body',       image: CAT_IMGS.bathBody,   bg: '#E3F2FD' },
    ],
  },
  {
    title: 'Household & Electronics',
    items: [
      { id: 21, name: 'Stationary & Games',    image: CAT_IMGS.stationary,  bg: '#FFF3E0' },
      { id: 22, name: 'Electronics',           image: CAT_IMGS.electronics, bg: '#E3F2FD' },
      { id: 23, name: 'Cleaners & Repellents', image: CAT_IMGS.cleaners,    bg: '#E8F5E9' },
      { id: 24, name: 'Toys',                  image: CAT_IMGS.toys,        bg: '#FFE0E0' },
    ],
  },
];

export default function CategoriesScreen({ onCategoryPress, onGoBack }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {ALL_GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.grid}>
              {group.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.75}
                  onPress={() => onCategoryPress?.(item.name)}
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
  card: { width: '25%', padding: 8, alignItems: 'center' },
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
