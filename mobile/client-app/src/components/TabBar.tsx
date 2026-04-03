import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TabName = 'home' | 'categories' | 'orders' | 'cart';

interface Tab {
  name: TabName;
  label: string;
  icon: string;        // inactive
  iconActive: string;  // active (filled)
}

const TABS: Tab[] = [
  { name: 'home',       label: 'Home',       icon: 'storefront-outline',      iconActive: 'storefront'         },
  { name: 'categories', label: 'Categories', icon: 'view-dashboard-outline',  iconActive: 'view-dashboard'     },
  { name: 'orders',     label: 'Orders',     icon: 'clipboard-list-outline',  iconActive: 'clipboard-list'     },
  { name: 'cart',       label: 'Cart',       icon: 'basket-outline',          iconActive: 'basket'             },
];

interface Props {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  cartCount?: number;
}

export default function TabBar({ activeTab, onTabPress, cartCount = 0 }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.name === activeTab;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <MaterialCommunityIcons
                name={(isActive ? tab.iconActive : tab.icon) as any}
                size={24}
                color={isActive ? '#5B2D8E' : '#999'}
              />
              {tab.name === 'cart' && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ebebeb',
    paddingTop: 8,
    paddingBottom: 24,
    elevation: 16,
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  icon: {
    fontSize: 22,
    marginBottom: 3,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: '#999',
  },
  labelActive: {
    color: '#5B2D8E',
    fontWeight: '700',
  },
  iconWrap: {
    position: 'relative',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 3,
  },
  iconWrapActive: {
    backgroundColor: '#F0E8FA',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 4,
    backgroundColor: '#5B2D8E',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
