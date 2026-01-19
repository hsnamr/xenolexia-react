/**
 * Vocabulary Card - Displays a saved word
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {VocabularyItem} from '@types/index';

interface VocabularyCardProps {
  item: VocabularyItem;
}

export function VocabularyCard({item}: VocabularyCardProps): React.JSX.Element {
  const [isRevealed, setIsRevealed] = useState(false);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'new':
        return '#0ea5e9';
      case 'learning':
        return '#f59e0b';
      case 'review':
        return '#8b5cf6';
      case 'learned':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsRevealed(!isRevealed)}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.foreignWord}>{item.targetWord}</Text>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status) + '20'}]}>
          <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      {isRevealed && (
        <>
          <Text style={styles.originalWord}>{item.sourceWord}</Text>
          {item.contextSentence && (
            <Text style={styles.context} numberOfLines={2}>
              "{item.contextSentence}"
            </Text>
          )}
          {item.bookTitle && (
            <Text style={styles.bookSource}>From: {item.bookTitle}</Text>
          )}
        </>
      )}

      {!isRevealed && <Text style={styles.tapHint}>Tap to reveal</Text>}

      <View style={styles.footer}>
        <Text style={styles.reviewCount}>
          Reviews: {item.reviewCount}
        </Text>
        {item.lastReviewedAt && (
          <Text style={styles.lastReviewed}>
            Next: {item.interval} day{item.interval !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foreignWord: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6366f1',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  originalWord: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  tapHint: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  context: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  bookSource: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  lastReviewed: {
    fontSize: 12,
    color: '#6b7280',
  },
});
