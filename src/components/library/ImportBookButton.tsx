/**
 * Import Book Button - Triggers file picker for importing books
 */

import React, {useCallback} from 'react';

import {Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
// import DocumentPicker from 'react-native-document-picker';

interface ImportBookButtonProps {
  variant?: 'small' | 'large';
}

export function ImportBookButton({variant = 'small'}: ImportBookButtonProps): React.JSX.Element {
  const handleImport = useCallback(async () => {
    try {
      // TODO: Implement actual file picking with DocumentPicker
      // const result = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.allFiles],
      //   allowMultiSelection: false,
      // });
      //
      // if (result && result[0]) {
      //   const file = result[0];
      //   // Parse book metadata using BookParserService
      //   // Add to library using useLibraryStore
      // }

      // For now, show a placeholder alert
      Alert.alert(
        'Import Book',
        'Book import functionality will be available once the EPUB parser is implemented.\n\nSupported formats:\n• EPUB\n• FB2\n• MOBI (DRM-free)\n• TXT',
        [{text: 'OK'}]
      );
    } catch (error) {
      // User cancelled or error occurred
      console.error('Import cancelled or failed:', error);
    }
  }, []);

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
  largeButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  largeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  smallButton: {
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '500',
  },
});
