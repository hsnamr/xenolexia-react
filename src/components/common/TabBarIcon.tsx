/**
 * Tab bar icon component
 * TODO: Replace with actual icons (react-native-vector-icons or custom SVGs)
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface TabBarIconProps {
  name: 'library' | 'vocabulary' | 'stats' | 'profile';
  color: string;
  size: number;
}

// Emoji placeholders - replace with proper icons
const iconMap: Record<TabBarIconProps['name'], string> = {
  library: '📚',
  vocabulary: '📝',
  stats: '📊',
  profile: '👤',
};

export function TabBarIcon({name, color, size}: TabBarIconProps): React.JSX.Element {
  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Text style={[styles.icon, {fontSize: size * 0.8}]}>{iconMap[name]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});
