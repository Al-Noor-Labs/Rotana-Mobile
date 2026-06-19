import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SHIMMER_COLOR = '#e0e0e0';
const SHIMMER_HIGHLIGHT = '#f0f0f0';

export function CategoryShimmer() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.6, 1],
  });

  return (
    <View style={styles.grid}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Animated.View key={item} style={[styles.shimmerCard, { opacity }]}>
          <View style={styles.shimmerImage} />
          <View style={[styles.shimmerText, { marginTop: 8 }]} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  shimmerCard: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
  },
  shimmerImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: SHIMMER_COLOR,
  },
  shimmerText: {
    width: 60,
    height: 14,
    borderRadius: 4,
    backgroundColor: SHIMMER_COLOR,
  },
});
