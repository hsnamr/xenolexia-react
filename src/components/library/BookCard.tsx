/**
 * Book Card - Displays a book in the library grid
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

import {useColors} from '@/theme';
import {spacing, borderRadius} from '@/theme/tokens';
import {Text} from '@components/ui';
import type {Book} from '@/types';

import {BookCover} from './BookCover';

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

const {width} = Dimensions.get('window');
const cardWidth = (width - 56) / 2; // 2 columns with padding and gap

const LANGUAGE_FLAGS: Record<string, string> = {
  el: '🇬🇷',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇷',
  ar: '🇸🇦',
  en: '🇬🇧',
};

export function BookCard({book, onPress}: BookCardProps): React.JSX.Element {
  const colors = useColors();

  const languageFlag = LANGUAGE_FLAGS[book.languagePair.targetLanguage] || '🌐';
  const hasProgress = book.progress > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {/* Book Cover */}
      <View style={styles.coverWrapper}>
        <BookCover
          bookId={book.id}
          coverPath={book.coverPath}
          title={book.title}
          size="medium"
          width="100%"
        />

        {/* Progress Bar */}
        {hasProgress && (
          <View style={[styles.progressContainer, {backgroundColor: colors.overlay}]}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${book.progress}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        )}

        {/* Language Badge */}
        <View style={[styles.languageBadge, {backgroundColor: colors.background}]}>
          <Text variant="bodySmall">{languageFlag}</Text>
        </View>

        {/* Progress percentage */}
        {hasProgress && (
          <View style={[styles.progressBadge, {backgroundColor: colors.background}]}>
            <Text variant="labelSmall" customColor={colors.primary}>
              {Math.round(book.progress)}%
            </Text>
          </View>
        )}
      </View>

      {/* Book Info */}
      <View style={styles.infoContainer}>
        <Text variant="labelMedium" numberOfLines={2} style={styles.title}>
          {book.title}
        </Text>
        <Text variant="bodySmall" color="secondary" numberOfLines={1}>
          {book.author}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
    width: cardWidth,
  },
  coverWrapper: {
    position: 'relative',
    width: '100%',
  },
  infoContainer: {
    paddingTop: spacing[2],
  },
  languageBadge: {
    borderRadius: borderRadius.md,
    padding: spacing[1],
    position: 'absolute',
    right: spacing[2],
    top: spacing[2],
    zIndex: 10,
  },
  progressBadge: {
    borderRadius: borderRadius.sm,
    bottom: spacing[2],
    left: spacing[2],
    paddingHorizontal: spacing[1.5],
    paddingVertical: spacing[0.5],
    position: 'absolute',
    zIndex: 10,
  },
  progressBar: {
    borderRadius: borderRadius.full,
    height: '100%',
  },
  progressContainer: {
    borderRadius: borderRadius.full,
    bottom: 0,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  title: {
    lineHeight: 18,
  },
});
