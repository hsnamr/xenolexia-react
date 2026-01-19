/**
 * Library Screen - Displays user's book collection
 */

import React, {useState, useCallback} from 'react';

import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';

import {BookCard} from '@components/library/BookCard';
import {EmptyLibrary} from '@components/library/EmptyLibrary';
import {ImportBookButton} from '@components/library/ImportBookButton';
import {useNavigation} from '@react-navigation/native';
import {useLibraryStore} from '@stores/libraryStore';
import {SafeAreaView} from 'react-native-safe-area-context';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {Book, RootStackParamList} from '@types/index';

type LibraryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function LibraryScreen(): React.JSX.Element {
  const navigation = useNavigation<LibraryNavigationProp>();
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
    [navigation]
  );

  const renderBook = useCallback(
    ({item}: {item: Book}) => <BookCard book={item} onPress={() => handleBookPress(item)} />,
    [handleBookPress]
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
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
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
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  title: {
    color: '#1f2937',
    fontSize: 28,
    fontWeight: '700',
  },
});
