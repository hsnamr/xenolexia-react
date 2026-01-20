/**
 * Import Book Button - Triggers file picker for importing books
 */

import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';

import {useColors} from '@/theme';
import {spacing, borderRadius} from '@/theme/tokens';
import {Button} from '@components/ui';
import {PlusIcon} from '@components/common/TabBarIcon';
import {ImportService} from '@services/ImportService';
import type {ImportProgress, SelectedFile} from '@services/ImportService';
import {useLibraryStore} from '@stores/libraryStore';
import {useUserStore} from '@stores/userStore';

import {ImportProgressModal} from './ImportProgressModal';

// ============================================================================
// Types
// ============================================================================

interface ImportBookButtonProps {
  variant?: 'small' | 'large';
  onImportComplete?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function ImportBookButton({
  variant = 'small',
  onImportComplete,
}: ImportBookButtonProps): React.JSX.Element {
  const colors = useColors();
  const {addBook} = useLibraryStore();
  const {preferences} = useUserStore();

  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

  const handleImport = useCallback(async () => {
    try {
      // Step 1: Select file
      setProgress({
        status: 'selecting',
        fileName: '',
        progress: 0,
        currentStep: 'Selecting file...',
      });
      setIsImporting(true);

      const file = await ImportService.selectFile();

      if (!file) {
        // User cancelled
        setIsImporting(false);
        setProgress(null);
        return;
      }

      setSelectedFile(file);
      setProgress({
        status: 'copying',
        fileName: file.name,
        progress: 5,
        currentStep: 'Preparing import...',
      });

      // Step 2: Import the book
      const result = await ImportService.importBook(file, {
        extractCover: true,
        parseMetadata: true,
        onProgress: setProgress,
      });

      if (result.success && result.bookId && result.metadata) {
        // Add book to library store
        addBook({
          id: result.bookId,
          title: result.metadata.title,
          author: result.metadata.author,
          coverPath: result.metadata.coverPath || null,
          filePath: result.filePath!,
          format: result.metadata.format,
          fileSize: result.metadata.fileSize,
          addedAt: new Date(),
          lastReadAt: null,
          languagePair: {
            sourceLanguage: preferences.defaultSourceLanguage,
            targetLanguage: preferences.defaultTargetLanguage,
          },
          proficiencyLevel: preferences.defaultProficiencyLevel,
          wordDensity: preferences.defaultWordDensity,
          progress: 0,
          currentLocation: null,
          currentChapter: 0,
          totalChapters: result.metadata.totalChapters || 0,
          currentPage: 0,
          totalPages: result.metadata.estimatedPages || 0,
          readingTimeMinutes: 0,
          isDownloaded: true,
        });

        onImportComplete?.();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Import failed';

      setProgress({
        status: 'error',
        fileName: selectedFile?.name || 'Unknown file',
        progress: 0,
        currentStep: 'Import failed',
        error: errorMessage,
      });

      Alert.alert('Import Failed', errorMessage, [{text: 'OK'}]);
    }
  }, [addBook, preferences, selectedFile, onImportComplete]);

  const handleDismiss = useCallback(() => {
    setIsImporting(false);
    setProgress(null);
    setSelectedFile(null);
  }, []);

  const handleCancel = useCallback(async () => {
    // Cancel import and clean up
    if (selectedFile) {
      // TODO: Cancel ongoing import if possible
    }
    handleDismiss();
  }, [selectedFile, handleDismiss]);

  // Render based on variant
  if (variant === 'large') {
    return (
      <>
        <Button variant="primary" size="lg" onPress={handleImport}>
          Import Book
        </Button>

        <ImportProgressModal
          visible={isImporting}
          progress={progress}
          onCancel={handleCancel}
          onDismiss={handleDismiss}
        />
      </>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.smallButton, {backgroundColor: colors.primary}]}
        onPress={handleImport}
        activeOpacity={0.8}>
        <PlusIcon color={colors.onPrimary} size={20} />
      </TouchableOpacity>

      <ImportProgressModal
        visible={isImporting}
        progress={progress}
        onCancel={handleCancel}
        onDismiss={handleDismiss}
      />
    </>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  smallButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
