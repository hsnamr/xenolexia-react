/**
 * Stat Card - Displays a single statistic
 */

import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  color: string;
}

const {width} = Dimensions.get('window');
const cardWidth = (width - 52) / 2; // 2 columns with padding and gap

export function StatCard({icon, value, label, color}: StatCardProps): React.JSX.Element {
  return (
    <View style={[styles.container, {borderLeftColor: color}]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, {color}]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
});
