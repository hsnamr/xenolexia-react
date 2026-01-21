/**
 * Reader Screen - Main book reading experience with foreign word integration
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import type { RootStackScreenProps } from '@types/navigation';
import type { ForeignWordData } from '@types/index';
import { useLibraryStore } from '@stores/libraryStore';
import {
  useReaderStore,
  selectHasNextChapter,
  selectHasPreviousChapter,
} from '@stores/readerStore';
import { TranslationPopup } from '@components/reader/TranslationPopup';
import { ReaderSettingsModal } from '@components/reader/ReaderSettingsModal';
import { ChapterNavigator } from '@components/reader/ChapterNavigator';
import { EPUBRenderer } from './components/EPUBRenderer';

type ReaderScreenProps = RootStackScreenProps<'Reader'>;

// ============================================================================
// Reader Screen Component
// ============================================================================

export function ReaderScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<ReaderScreenProps['route']>();
  const { bookId } = route.params;

  // Store hooks
  const { getBook, updateBookProgress } = useLibraryStore();
  const {
    currentBook,
    currentChapter,
    processedHtml,
    settings,
    isLoading,
    isLoadingChapter,
    error,
    overallProgress,
    scrollPosition,
    loadBook,
    goToNextChapter,
    goToPreviousChapter,
    updateProgress,
    updateScrollPosition,
    closeBook,
  } = useReaderStore();

  const hasNext = useReaderStore(selectHasNextChapter);
  const hasPrevious = useReaderStore(selectHasPreviousChapter);

  const book = getBook(bookId);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [selectedWord, setSelectedWord] = useState<ForeignWordData | null>(null);
  const [showControls, setShowControls] = useState(true);

  // Load book on mount
  useEffect(() => {
    if (book && (!currentBook || currentBook.id !== book.id)) {
      loadBook(book);
    }
  }, [book, currentBook, loadBook]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Save progress before closing
      if (currentBook) {
        updateBookProgress(currentBook.id, overallProgress);
      }
      closeBook();
    };
  }, [currentBook, overallProgress, updateBookProgress, closeBook]);

  // Handlers
  const handleWordTap = useCallback((word: ForeignWordData) => {
    setSelectedWord(word);
    setShowControls(false);
  }, []);

  const handleDismissPopup = useCallback(() => {
    setSelectedWord(null);
  }, []);

  const handleToggleControls = useCallback(() => {
    if (!selectedWord) {
      setShowControls((prev) => !prev);
    }
  }, [selectedWord]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleProgressChange = useCallback(
    (progress: number) => {
      updateProgress(progress);
    },
    [updateProgress]
  );

  const handleContentReady = useCallback(
    (scrollHeight: number) => {
      // Restore scroll position if available
      if (scrollPosition > 0) {
        updateScrollPosition(scrollPosition);
      }
    },
    [scrollPosition, updateScrollPosition]
  );

  // Get theme colors
  const themeColors = getThemeColors(settings.theme);

  // Error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.text }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => book && loadBook(book)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Book not found
  if (!book) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.text }]}>
            Book not found
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.accent} />
          <Text style={[styles.loadingText, { color: themeColors.text }]}>
            Loading book...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      edges={['top']}>
      {/* Header Controls */}
      {showControls && (
        <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: themeColors.text }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text
              style={[styles.bookTitle, { color: themeColors.text }]}
              numberOfLines={1}>
              {book.title}
            </Text>
            <Text
              style={[styles.chapterTitle, { color: themeColors.textMuted }]}
              numberOfLines={1}>
              {currentChapter?.title || 'Loading...'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reader Content */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleToggleControls}
        style={styles.readerContainer}>
        {isLoadingChapter ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={themeColors.accent} />
          </View>
        ) : processedHtml ? (
          <EPUBRenderer
            html={processedHtml}
            settings={settings}
            onProgressChange={handleProgressChange}
            onWordTap={handleWordTap}
            onContentReady={handleContentReady}
            initialScrollY={scrollPosition}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              No content available
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Footer Controls */}
      {showControls && (
        <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
          <TouchableOpacity
            onPress={goToPreviousChapter}
            style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]}
            disabled={!hasPrevious}>
            <Text
              style={[
                styles.navButtonText,
                { color: hasPrevious ? themeColors.accent : themeColors.textMuted },
              ]}>
              ‹ Previous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowChapters(true)}
            style={[styles.chapterButton, { backgroundColor: themeColors.cardBackground }]}>
            <Text style={[styles.progressText, { color: themeColors.text }]}>
              {overallProgress.toFixed(0)}%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goToNextChapter}
            style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
            disabled={!hasNext}>
            <Text
              style={[
                styles.navButtonText,
                { color: hasNext ? themeColors.accent : themeColors.textMuted },
              ]}>
              Next ›
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Translation Popup */}
      {selectedWord && (
        <TranslationPopup word={selectedWord} onDismiss={handleDismissPopup} />
      )}

      {/* Settings Modal */}
      <ReaderSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Chapter Navigator Modal */}
      <ChapterNavigator
        visible={showChapters}
        onClose={() => setShowChapters(false)}
        bookId={bookId}
      />
    </SafeAreaView>
  );
}

// ============================================================================
// Theme Helper
// ============================================================================

interface ThemeColors {
  background: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
  cardBackground: string;
}

function getThemeColors(theme: 'light' | 'dark' | 'sepia'): ThemeColors {
  switch (theme) {
    case 'dark':
      return {
        background: '#1a1a2e',
        text: '#e5e7eb',
        textMuted: '#9ca3af',
        accent: '#818cf8',
        border: 'rgba(255,255,255,0.1)',
        cardBackground: '#2d2d44',
      };
    case 'sepia':
      return {
        background: '#f4ecd8',
        text: '#5c4b37',
        textMuted: '#8b7355',
        accent: '#9333ea',
        border: 'rgba(0,0,0,0.1)',
        cardBackground: '#e8dcc8',
      };
    default:
      return {
        background: '#ffffff',
        text: '#1f2937',
        textMuted: '#6b7280',
        accent: '#6366f1',
        border: 'rgba(0,0,0,0.1)',
        cardBackground: '#f3f4f6',
      };
  }
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chapterTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  readerContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navButton: {
    padding: 8,
    minWidth: 80,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  chapterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
