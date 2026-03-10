import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

const categories = [
  { id: 1, name: 'Atta, Rice\n& Dal', icon: '🌾', bgColor: '#FFF3E0' },
  { id: 2, name: 'Dry Fruits &\nCereals', icon: '🥜', bgColor: '#FFE0E0' },
  { id: 3, name: 'Dairy, Bread\n& Eggs', icon: '🥛', bgColor: '#E3F2FD' },
  { id: 4, name: 'Bakery &\nBiscuits', icon: '🍞', bgColor: '#FFF9C4' },
  { id: 5, name: 'Oil &\nMasala', icon: '🫙', bgColor: '#FFE0E0' },
  { id: 6, name: 'Kitchenware\n& Appliances', icon: '🍳', bgColor: '#F3E5F5' },
  { id: 7, name: 'Fruits and\nVegetables', icon: '🥬', bgColor: '#E8F5E9' },
  { id: 8, name: 'Chicken,\nMeat & Fish', icon: '🍗', bgColor: '#FFEBEE' },
];

const snacksCategories = [
  { id: 1, name: 'Tea &\nCoffee', icon: '☕', bgColor: '#FFF3E0' },
  { id: 2, name: 'Sweets &\nChocolates', icon: '🍫', bgColor: '#FFE0E0' },
  { id: 3, name: 'Drinks &\nJuices', icon: '🧃', bgColor: '#E3F2FD' },
  { id: 4, name: 'Chips &\nNamkeen', icon: '🍟', bgColor: '#FFEBEE' },
  { id: 5, name: 'Sauces &\nSpreads', icon: '🍯', bgColor: '#FFF9C4' },
  { id: 6, name: 'Pan\nCorner', icon: '🌿', bgColor: '#E8F5E9' },
  { id: 7, name: 'Instant\nFood', icon: '🍜', bgColor: '#FFF3E0' },
  { id: 8, name: 'Ice Creams\n& More', icon: '🍦', bgColor: '#E1F5FE' },
];

const beautyCategories = [
  { id: 1, name: 'Skin &\nFace', icon: '💄', bgColor: '#FCE4EC' },
  { id: 2, name: 'Hair Care', icon: '💇', bgColor: '#F3E5F5' },
  { id: 3, name: 'Feminine\nHygiene', icon: '🧴', bgColor: '#FFE0E0' },
  { id: 4, name: 'Bath\n& Body', icon: '🧼', bgColor: '#E3F2FD' },
  { id: 5, name: 'Vitamins &\nSuppliments', icon: '💊', bgColor: '#FFF9C4' },
  { id: 6, name: 'Sexual\nWellness', icon: '❤️', bgColor: '#FFEBEE' },
  { id: 7, name: 'Health Care\nEquipments', icon: '🩺', bgColor: '#E8F5E9' },
  { id: 8, name: 'Wound\nCare', icon: '🩹', bgColor: '#FFE0E0' },
];

const householdCategories = [
  { id: 1, name: 'Stationary &\nGames', icon: '✏️', bgColor: '#FFF3E0' },
  { id: 2, name: 'Electronics', icon: '🔌', bgColor: '#E3F2FD' },
  { id: 3, name: 'Cleaners &\nRepellents', icon: '🧹', bgColor: '#E8F5E9' },
  { id: 4, name: 'Toys', icon: '🎮', bgColor: '#FFE0E0' },
];

export default function HomeScreen() {
  const [cartItems, setCartItems] = useState(0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>Delivery in</Text>
            <Text style={styles.deliveryTime}>10 Minutes</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.address} numberOfLines={1}>
                8-2-5, 2nd building, Tolichowki, Hyderabad
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for 'bread'"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Store Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusTitle}>We will next open</Text>
            <Text style={styles.statusTime}>at 8 am</Text>
            <Text style={styles.statusSubtext}>
              You can still add items and{'\n'}order when the store re-opens
            </Text>
          </View>
          <View style={styles.closedBadge}>
            <View style={styles.closedBadgeInner}>
              <Text style={styles.closedText}>Sorry, we are</Text>
              <Text style={styles.closedTextBold}>CLOSED</Text>
            </View>
          </View>
        </View>

        {/* Groceries and Kitchen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Groceries and Kitchen</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIconBox, { backgroundColor: category.bgColor }]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Snacks & Drinks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Snacks & Drinks</Text>
          <View style={styles.categoryGrid}>
            {snacksCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIconBox, { backgroundColor: category.bgColor }]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Beauty & Personal Care */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beauty & Personal Care</Text>
          <View style={styles.categoryGrid}>
            {beautyCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIconBox, { backgroundColor: category.bgColor }]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Household */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Household</Text>
          <View style={styles.categoryGrid}>
            {householdCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIconBox, { backgroundColor: category.bgColor }]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chicken, Meat & Fish Banner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chicken, Meat & Fish</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.productCard}>
              <View style={styles.productImage}>
                <Text style={styles.productImagePlaceholder}>🍗</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
              <Text style={styles.productWeight}>400 g</Text>
              <Text style={styles.productName}>Chicken Curry Cut</Text>
              <Text style={styles.productPrice}>₹Range: ₹9 to 10 P...</Text>
            </View>
            <View style={styles.productCard}>
              <View style={styles.productImage}>
                <Text style={styles.productImagePlaceholder}>🐔</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
              <Text style={styles.productWeight}>1000 g</Text>
              <Text style={styles.productName}>Chicken Curry Cut</Text>
              <Text style={styles.productPrice}>₹Range: ₹9 to 10 k...</Text>
            </View>
            <View style={styles.productCard}>
              <View style={styles.productImage}>
                <Text style={styles.productImagePlaceholder}>🐟</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
              <Text style={styles.productWeight}>1 kg</Text>
              <Text style={styles.productName}>Indian Curry Cut</Text>
              <Text style={styles.productPrice}>₹Range: ₹8 to 10 (s...</Text>
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItems > 0 && (
        <TouchableOpacity style={styles.cartButton}>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems}</Text>
          </View>
          <Text style={styles.cartButtonText}>View cart</Text>
          <Text style={styles.cartIcon}>→</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💊</Text>
          <Text style={styles.navLabel}>Pharmacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#000',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
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
    backgroundColor: '#333',
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
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
    fontSize: 18,
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
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 10,
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
    top: 100,
    right: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF4D6D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FF4D6D',
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  cartButton: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#FF4D6D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  cartBadge: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FF4D6D',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cartIcon: {
    color: '#fff',
    fontSize: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  navIconActive: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
  },
  navLabelActive: {
    fontSize: 10,
    color: '#FF4D6D',
    fontWeight: '600',
  },
});
