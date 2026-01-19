/**
 * Empty Library - Shown when no books are imported
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ImportBookButton} from './ImportBookButton';

export function EmptyLibrary(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📚</Text>
      <Text style={styles.title}>Your Library is Empty</Text>
      <Text style={styles.description}>
        Import your first book to start learning through reading. 
        We support EPUB and other DRM-free formats.
      </Text>
      <ImportBookButton variant="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});
