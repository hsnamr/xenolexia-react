/**
 * Empty Library - Shown when no books are imported
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {ImportBookButton} from './ImportBookButton';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/types';

type EmptyLibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function EmptyLibrary(): React.JSX.Element {
  const navigation = useNavigation<EmptyLibraryNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📚</Text>
      <Text style={styles.title}>Your Library is Empty</Text>
      <Text style={styles.description}>
        Import a book from your device or browse free ebooks online.
      </Text>

      <View style={styles.buttonContainer}>
        <ImportBookButton variant="large" />

        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('BookDiscovery')}
          activeOpacity={0.8}>
          <Text style={styles.browseButtonText}>Browse Free Books</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.supportedFormats}>
        Supported: EPUB, FB2, MOBI (DRM-free), TXT
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  browseButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#0ea5e9',
    borderRadius: 30,
    borderWidth: 2,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  browseButtonText: {
    color: '#0ea5e9',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  description: {
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  supportedFormats: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    color: '#1f2937',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
});
