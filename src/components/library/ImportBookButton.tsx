/**
 * Import Book Button - Triggers file picker for importing books
 */

import React, {useCallback} from 'react';
import {Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
import {useLibraryStore} from '@stores/libraryStore';
import {useUserStore} from '@stores/userStore';
import type {Book} from '@types/index';

interface ImportBookButtonProps {
  variant?: 'small' | 'large';
}

export function ImportBookButton({variant = 'small'}: ImportBookButtonProps): React.JSX.Element {
  const {addBook} = useLibraryStore();
  const {preferences} = useUserStore();

  const handleImport = useCallback(async () => {
    try {
      // TODO: Implement actual file picking
      // const result = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.allFiles],
      //   allowMultiSelection: false,
      // });
      //
      // if (result && result[0]) {
      //   const file = result[0];
      //   // Parse book metadata
      //   // Add to library
      // }

      // For now, show a placeholder alert
      Alert.alert(
        'Import Book',
        'Book import functionality will be available once the EPUB parser is implemented.\n\nSupported formats:\n• EPUB\n• FB2\n• MOBI (DRM-free)\n• TXT',
        [{text: 'OK'}],
      );
    } catch (error) {
      // User cancelled or error occurred
      console.log('Import cancelled or failed:', error);
    }
  }, [addBook, preferences]);

  if (variant === 'large') {
    return (
      <TouchableOpacity style={styles.largeButton} onPress={handleImport} activeOpacity={0.8}>
        <Text style={styles.largeButtonText}>Import Book</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.smallButton} onPress={handleImport} activeOpacity={0.8}>
      <Text style={styles.smallButtonText}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  smallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '500',
  },
  largeButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  largeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
