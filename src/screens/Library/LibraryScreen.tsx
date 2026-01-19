/**
 * Library Screen - Displays user's book collection
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import type {Book} from '@types/index';
import {useLibraryStore} from '@stores/libraryStore';
import {BookCard} from '@components/library/BookCard';
import {EmptyLibrary} from '@components/library/EmptyLibrary';
import {ImportBookButton} from '@components/library/ImportBookButton';

export function LibraryScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {books, isLoading, refreshBooks} = useLibraryStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshBooks();
    setIsRefreshing(false);
  }, [refreshBooks]);

  const handleBookPress = useCallback(
    (book: Book) => {
      navigation.navigate('Reader', {bookId: book.id});
    },
    [navigation],
  );

  const renderBook = useCallback(
    ({item}: {item: Book}) => <BookCard book={item} onPress={() => handleBookPress(item)} />,
    [handleBookPress],
  );

  const keyExtractor = useCallback((item: Book) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <ImportBookButton />
      </View>

      {books.length === 0 && !isLoading ? (
        <EmptyLibrary />
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
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
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});
