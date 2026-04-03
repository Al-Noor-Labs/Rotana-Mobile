import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  productId: string;
  quantity: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  size?: 'sm' | 'md';
}

export default function AddButton({ productId, quantity, onAdd, onRemove, size = 'md' }: Props) {
  const dim = size === 'sm' ? 28 : 32;
  const iconSize = size === 'sm' ? 14 : 16;

  if (quantity === 0) {
    return (
      <TouchableOpacity
        style={[styles.addCircle, { width: dim, height: dim, borderRadius: dim / 2 }]}
        onPress={() => onAdd(productId)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={iconSize} color="#fff" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.counter, size === 'sm' && styles.counterSm]}>
      <TouchableOpacity
        style={[styles.counterBtn, { height: size === 'sm' ? 28 : 32 }]}
        onPress={() => onRemove(productId)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="minus" size={iconSize} color="#5B2D8E" />
      </TouchableOpacity>
      <Text style={[styles.qty, size === 'sm' && styles.qtySm]}>{quantity}</Text>
      <TouchableOpacity
        style={[styles.counterBtn, { height: size === 'sm' ? 28 : 32 }]}
        onPress={() => onAdd(productId)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={iconSize} color="#5B2D8E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addCircle: {
    backgroundColor: '#5B2D8E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#5B2D8E',
    borderRadius: 8,
    height: 32,
    overflow: 'hidden',
  },
  counterSm: {
    height: 28,
    borderRadius: 6,
  },
  counterBtn: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qty: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B2D8E',
    minWidth: 20,
    textAlign: 'center',
  },
  qtySm: {
    fontSize: 11,
    minWidth: 16,
  },
});
