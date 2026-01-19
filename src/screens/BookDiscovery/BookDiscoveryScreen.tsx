/**
 * Book Discovery Screen - Search and download ebooks from online sources
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@types/index';
import {BookDownloadService, EBOOK_SOURCES} from '@services/BookDownloadService';
import type {EbookSearchResult, EbookSource} from '@services/BookDownloadService';

type DiscoveryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function BookDiscoveryScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoveryNavigationProp>();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EbookSearchResult[]>([]);
  const [selectedSource, setSelectedSource] = useState<EbookSource['type']>('gutenberg');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const searchResults = await BookDownloadService.searchBooks(searchQuery, selectedSource);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedSource]);

  const handleDownload = useCallback(async (book: EbookSearchResult) => {
    setDownloadingId(book.id);
    try {
      const result = await BookDownloadService.downloadFromUrl(book.downloadUrl, book.id);

      if (result.success) {
        // TODO: Add to library using useLibraryStore
        // Show success message
        console.log('Download complete:', result.filePath);
      } else {
        console.error('Download failed:', result.error);
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const renderSourceTab = ({type, name}: EbookSource) => (
    <TouchableOpacity
      key={type}
      style={[styles.sourceTab, selectedSource === type && styles.sourceTabActive]}
      onPress={() => setSelectedSource(type)}>
      <Text style={[styles.sourceTabText, selectedSource === type && styles.sourceTabTextActive]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

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
        </Text>
        <TouchableOpacity
          style={[styles.downloadButton, downloadingId === item.id && styles.downloadButtonDisabled]}
          onPress={() => handleDownload(item)}
          disabled={downloadingId === item.id}>
          {downloadingId === item.id ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.downloadButtonText}>Download</Text>
          )}
        </TouchableOpacity>
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

      {/* Results */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Find Free Ebooks</Text>
          <Text style={styles.emptyDescription}>
            Search millions of free, public domain books from Project Gutenberg, Standard Ebooks,
            and Open Library.
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
});
