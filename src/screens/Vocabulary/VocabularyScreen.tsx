/**
 * Vocabulary Screen - Displays saved words and review options
 */

import React, {useState, useCallback, useMemo} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useColors} from '@/theme';
import {spacing, borderRadius} from '@/theme/tokens';
import type {VocabularyItem, RootStackParamList} from '@/types';

import {useVocabularyStore} from '@stores/vocabularyStore';
import {VocabularyCard} from '@components/vocabulary/VocabularyCard';
import {EmptyVocabulary} from '@components/vocabulary/EmptyVocabulary';
import {ScreenHeader, LoadingList, EmptySearchResults} from '@components/common';
import {Text, SearchInput, Button} from '@components/ui';

type VocabularyNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FilterType = 'all' | 'new' | 'learning' | 'learned';

interface FilterOption {
  id: FilterType;
  label: string;
  icon: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  {id: 'all', label: 'All', icon: '📚'},
  {id: 'new', label: 'New', icon: '✨'},
  {id: 'learning', label: 'Learning', icon: '📖'},
  {id: 'learned', label: 'Mastered', icon: '🎯'},
];

export function VocabularyScreen(): React.JSX.Element {
  const navigation = useNavigation<VocabularyNavigationProp>();
  const colors = useColors();
  const {vocabulary, isLoading, refreshVocabulary} = useVocabularyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and search vocabulary
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter(item => {
      const matchesSearch =
        searchQuery.length === 0 ||
        item.sourceWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetWord.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filter === 'all' || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [vocabulary, searchQuery, filter]);

  // Count by status
  const statusCounts = useMemo(() => {
    return vocabulary.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [vocabulary]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshVocabulary();
    setIsRefreshing(false);
  }, [refreshVocabulary]);

  const handleWordPress = useCallback(
    (item: VocabularyItem) => {
      navigation.navigate('VocabularyDetail', {wordId: item.id});
    },
    [navigation]
  );

  const handleStartQuiz = useCallback(() => {
    navigation.navigate('VocabularyQuiz', {});
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: {item: VocabularyItem}) => (
      <VocabularyCard item={item} onPress={() => handleWordPress(item)} />
    ),
    [handleWordPress]
  );

  const keyExtractor = useCallback((item: VocabularyItem) => item.id, []);

  const renderFilterButton = ({id, label, icon}: FilterOption) => {
    const isActive = filter === id;
    const count = id === 'all' ? vocabulary.length : statusCounts[id] || 0;

    return (
      <TouchableOpacity
        key={id}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive ? colors.primary : colors.surfaceHover,
            borderColor: isActive ? colors.primary : colors.border,
          },
        ]}
        onPress={() => setFilter(id)}
        activeOpacity={0.7}
      >
        <Text variant="bodySmall">{icon}</Text>
        <Text
          variant="labelSmall"
          customColor={isActive ? colors.onPrimary : colors.text}
          style={styles.filterLabel}
        >
          {label}
        </Text>
        <View style={[styles.filterBadge, {backgroundColor: isActive ? colors.onPrimary : colors.border}]}>
          <Text
            variant="labelSmall"
            customColor={isActive ? colors.primary : colors.textSecondary}
          >
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search words..."
        containerStyle={styles.searchInput}
      />

      {/* Filters */}
      <View style={styles.filterContainer}>
        {FILTER_OPTIONS.map(renderFilterButton)}
      </View>

      {/* Quiz button */}
      {vocabulary.length > 0 && (
        <View style={styles.quizButtonContainer}>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Text variant="bodyMedium">🧠</Text>}
            onPress={handleStartQuiz}
          >
            Practice Quiz
          </Button>
        </View>
      )}
    </View>
  );

  const showEmptyState = filteredVocabulary.length === 0 && !isLoading;
  const showNoResults = showEmptyState && (searchQuery.length > 0 || filter !== 'all');

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top']}>
      <ScreenHeader
        title="Vocabulary"
        subtitle={vocabulary.length > 0 ? `${vocabulary.length} words saved` : undefined}
      />

      {isLoading && vocabulary.length === 0 ? (
        <LoadingList count={8} />
      ) : vocabulary.length === 0 ? (
        <EmptyVocabulary hasFilter={false} />
      ) : (
        <FlatList
          data={filteredVocabulary}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            showNoResults ? (
              <EmptySearchResults
                query={searchQuery}
                onClear={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
              />
            ) : null
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBadge: {
    borderRadius: borderRadius.full,
    marginLeft: spacing[1],
    minWidth: 20,
    paddingHorizontal: spacing[1.5],
    paddingVertical: spacing[0.5],
  },
  filterButton: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  filterLabel: {
    marginLeft: spacing[1],
  },
  headerContent: {
    paddingBottom: spacing[4],
  },
  listContent: {
    paddingBottom: spacing[8],
    paddingHorizontal: spacing[5],
  },
  quizButtonContainer: {
    alignItems: 'flex-start',
    marginTop: spacing[4],
  },
  searchInput: {
    marginBottom: 0,
  },
});
