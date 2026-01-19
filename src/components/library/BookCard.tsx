/**
 * Book Card - Displays a book in the library grid
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import type {Book} from '@types/index';

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

const {width} = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export function BookCard({book, onPress}: BookCardProps): React.JSX.Element {
  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      el: '🇬🇷',
      es: '🇪🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
      it: '🇮🇹',
      pt: '🇵🇹',
    };
    return flags[code] || '🌐';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Book Cover */}
      <View style={styles.coverContainer}>
        {book.coverPath ? (
          <Image source={{uri: book.coverPath}} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderEmoji}>📖</Text>
            <Text style={styles.placeholderTitle} numberOfLines={3}>
              {book.title}
            </Text>
          </View>
        )}
        
        {/* Progress Bar */}
        {book.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, {width: `${book.progress}%`}]} />
          </View>
        )}
        
        {/* Language Badge */}
        <View style={styles.languageBadge}>
          <Text style={styles.languageFlag}>
            {getLanguageFlag(book.languagePair.targetLanguage)}
          </Text>
        </View>
      </View>

      {/* Book Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  coverContainer: {
    width: '100%',
    aspectRatio: 0.65,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0ea5e9',
  },
  languageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 4,
  },
  languageFlag: {
    fontSize: 16,
  },
  infoContainer: {
    paddingTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 18,
  },
  author: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});
