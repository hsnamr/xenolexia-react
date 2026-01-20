/**
 * Import Book Button - Triggers file picker for importing books
 */

import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';

import {useColors} from '@/theme';
import {spacing, borderRadius} from '@/theme/tokens';
import {Text, Button} from '@components/ui';
import {PlusIcon} from '@components/common/TabBarIcon';

// TODO: Uncomment when ready to implement
// import DocumentPicker from 'react-native-document-picker';
// import {useLibraryStore} from '@stores/libraryStore';

interface ImportBookButtonProps {
  variant?: 'small' | 'large';
}

export function ImportBookButton({variant = 'small'}: ImportBookButtonProps): React.JSX.Element {
  const colors = useColors();

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
      <Button variant="primary" size="lg" onPress={handleImport}>
        Import Book
      </Button>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.smallButton, {backgroundColor: colors.primary}]}
      onPress={handleImport}
      activeOpacity={0.8}
    >
      <PlusIcon color={colors.onPrimary} size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  smallButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
