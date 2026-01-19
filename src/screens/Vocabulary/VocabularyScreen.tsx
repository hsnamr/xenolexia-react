/**
 * Vocabulary Screen - Displays saved words and review options
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import type {VocabularyItem} from '@types/index';
import {useVocabularyStore} from '@stores/vocabularyStore';
import {VocabularyCard} from '@components/vocabulary/VocabularyCard';
import {EmptyVocabulary} from '@components/vocabulary/EmptyVocabulary';

type FilterType = 'all' | 'new' | 'learning' | 'learned';

export function VocabularyScreen(): React.JSX.Element {
  const {vocabulary, isLoading} = useVocabularyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredVocabulary = vocabulary.filter(item => {
    const matchesSearch =
      item.sourceWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetWord.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filter === 'all' || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  const renderItem = useCallback(
    ({item}: {item: VocabularyItem}) => <VocabularyCard item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: VocabularyItem) => item.id, []);

  const FilterButton = ({type, label}: {type: FilterType; label: string}) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}>
      <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary</Text>
        <Text style={styles.subtitle}>{vocabulary.length} words saved</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search words..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <FilterButton type="all" label="All" />
        <FilterButton type="new" label="New" />
        <FilterButton type="learning" label="Learning" />
        <FilterButton type="learned" label="Learned" />
      </View>

      {filteredVocabulary.length === 0 && !isLoading ? (
        <EmptyVocabulary hasFilter={searchQuery.length > 0 || filter !== 'all'} />
      ) : (
        <FlatList
          data={filteredVocabulary}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 20,
  },
});
