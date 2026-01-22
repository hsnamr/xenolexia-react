/**
 * Book Discovery Screen - Search and download ebooks from online sources
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@types/index';
import {BookDownloadService, EBOOK_SOURCES} from '@services/BookDownloadService';
import type {EbookSearchResult, EbookSource, SearchResponse, DownloadProgress} from '@services/BookDownloadService';
import {useLibraryStore} from '@stores/libraryStore';

type DiscoveryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function BookDiscoveryScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoveryNavigationProp>();
  const {addBook, initialize: initializeLibrary} = useLibraryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EbookSearchResult[]>([]);
  const [selectedSource, setSelectedSource] = useState<EbookSource['type']>('gutenberg');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize library store on mount
  useEffect(() => {
    initializeLibrary();
  }, [initializeLibrary]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setHasSearched(true);

    try {
      const response: SearchResponse = await BookDownloadService.searchBooks(
        searchQuery,
        selectedSource
      );
      setResults(response.results);

      if (response.error && response.results.length === 0) {
        setErrorMessage(response.error);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Search failed. Please check your internet connection and try again.'
      );
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedSource]);

  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      // For web, use window.alert or set state message
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const handleDownload = useCallback(async (book: EbookSearchResult, promptForLocation: boolean = false) => {
    setDownloadingId(book.id);
    setDownloadProgress(0);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Ensure file system access on web
    if (Platform.OS === 'web') {
      const hasAccess = await BookDownloadService.hasFileSystemAccess();
      if (!hasAccess) {
        const message = 'Xenolexia needs access to a folder to save downloaded books.\n\n' +
          'Please select or create a folder (e.g., "Xenolexia Books" in your Documents).';
        
        const proceed = window.confirm(message + '\n\nClick OK to choose a folder.');
        if (!proceed) {
          setDownloadingId(null);
          return;
        }

        const granted = await BookDownloadService.requestFileSystemAccess();
        if (!granted) {
          showAlert('Access Required', 'A folder is required to save books. Please try again and select a folder.');
          setDownloadingId(null);
          return;
        }
      }
    }

    const onProgress = (progress: DownloadProgress) => {
      setDownloadProgress(progress.percentage);
    };

    try {
      const result = await BookDownloadService.downloadBook(book, onProgress, promptForLocation);

      if (result.success && result.book) {
        // Add book to library
        await addBook(result.book);

        // Remove from search results to indicate it's downloaded
        setResults(prev => prev.filter(r => r.id !== book.id));

        // Navigate to reader with the new book
        navigation.navigate('Reader', {bookId: result.book.id});
      } else {
        setErrorMessage(result.error || 'Download failed');
        showAlert('Download Failed', result.error || 'An error occurred while downloading the book.');
      }
    } catch (error) {
      console.error('Download error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Download failed';
      setErrorMessage(errorMsg);
      showAlert('Download Error', errorMsg);
    } finally {
      setDownloadingId(null);
      setDownloadProgress(0);
    }
  }, [addBook, showAlert, navigation]);

  const handleDownloadWithPicker = useCallback((book: EbookSearchResult) => {
    handleDownload(book, true);
  }, [handleDownload]);

  const handleSourceChange = useCallback((source: EbookSource['type']) => {
    setSelectedSource(source);
    // Clear results and error when changing source
    setResults([]);
    setErrorMessage(null);
    setHasSearched(false);
  }, []);

  const renderSourceTab = ({type, name}: EbookSource) => (
    <TouchableOpacity
      key={type}
      style={[styles.sourceTab, selectedSource === type && styles.sourceTabActive]}
      onPress={() => handleSourceChange(type)}>
      <Text style={[styles.sourceTabText, selectedSource === type && styles.sourceTabTextActive]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  const isDownloading = (id: string) => downloadingId === id;

  const renderBookResult = ({item}: {item: EbookSearchResult}) => (
    <View style={styles.resultCard}>
      {item.coverUrl ? (
        <Image source={{uri: item.coverUrl}} style={styles.resultCover} />
      ) : (
        <View style={styles.resultCoverPlaceholder}>
          <Text style={styles.resultCoverEmoji}>📖</Text>
        </View>
      )}
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.resultAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={styles.resultMeta}>
          {item.format.toUpperCase()} • {item.source}
          {item.language && ` • ${item.language.toUpperCase()}`}
        </Text>
        {item.description && (
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Download Progress Bar */}
        {isDownloading(item.id) && downloadProgress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, {width: `${downloadProgress}%`}]} />
            <Text style={styles.progressText}>{downloadProgress}%</Text>
          </View>
        )}

        {/* Download Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.downloadButton, isDownloading(item.id) && styles.downloadButtonDisabled]}
            onPress={() => handleDownload(item, false)}
            disabled={isDownloading(item.id)}>
            {isDownloading(item.id) ? (
              <View style={styles.downloadingContent}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.downloadButtonText}>
                  {downloadProgress > 0 ? `${downloadProgress}%` : 'Starting...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.downloadButtonText}>Add to Library</Text>
            )}
          </TouchableOpacity>

          {/* Save As button - shows file picker on web */}
          {Platform.OS === 'web' && !isDownloading(item.id) && (
            <TouchableOpacity
              style={styles.saveAsButton}
              onPress={() => handleDownloadWithPicker(item)}>
              <Text style={styles.saveAsButtonText}>Save As...</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const searchableSources = EBOOK_SOURCES.filter(s => s.searchEnabled);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Discover Books</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for books..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Source Tabs */}
      <View style={styles.sourceTabs}>{searchableSources.map(renderSourceTab)}</View>

      {/* Success Message */}
      {successMessage && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✓ {successMessage}</Text>
          <TouchableOpacity onPress={() => setSuccessMessage(null)}>
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Searching {selectedSource}...</Text>
        </View>
      ) : errorMessage && hasSearched ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Search Issue</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleSearch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : results.length === 0 && !hasSearched ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Find Free Ebooks</Text>
          <Text style={styles.emptyDescription}>
            Search millions of free, public domain books from Project Gutenberg, Standard Ebooks,
            and Open Library.
          </Text>
        </View>
      ) : results.length === 0 && hasSearched ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyDescription}>
            Try different keywords or search in another source.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderBookResult}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#dc2626',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButton: {
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  downloadButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyDescription: {
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#1f2937',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 12,
  },
  placeholder: {
    width: 50,
  },
  resultAuthor: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 2,
  },
  resultCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
  },
  resultCover: {
    borderRadius: 8,
    height: 120,
    width: 80,
  },
  resultCoverEmoji: {
    fontSize: 32,
  },
  resultCoverPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    width: 80,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultMeta: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  resultTitle: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsList: {
    padding: 16,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    marginLeft: 8,
    width: 48,
  },
  searchButtonText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    color: '#1f2937',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sourceTab: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sourceTabActive: {
    backgroundColor: '#0ea5e9',
  },
  sourceTabText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  sourceTabTextActive: {
    color: '#ffffff',
  },
  sourceTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: '600',
  },
  // New styles for download functionality
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  downloadingContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveAsButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderColor: '#0ea5e9',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveAsButtonText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    height: 8,
    marginTop: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    backgroundColor: '#0ea5e9',
    height: '100%',
  },
  progressText: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
  },
  resultDescription: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  successBanner: {
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderBottomColor: '#86efac',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  successText: {
    color: '#166534',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  dismissText: {
    color: '#166534',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
});
