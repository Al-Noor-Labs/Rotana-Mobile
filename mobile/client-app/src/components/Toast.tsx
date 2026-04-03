import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  cartCount: number;
  onPress?: () => void;
}

export default function Toast({ visible, cartCount, onPress }: Props) {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(30);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 30, duration: 180, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 0,  duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }], opacity }]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.button}
      >
        <MaterialCommunityIcons name="cart-check" size={20} color="#fff" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>View Cart</Text>
          <Text style={styles.subText}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: '12.5%',
    right: '12.5%',
    width: '75%',
    elevation: 12,
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B2D8E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
  },
  icon: {
    marginRight: 12,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  subText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.9,
  },
});
