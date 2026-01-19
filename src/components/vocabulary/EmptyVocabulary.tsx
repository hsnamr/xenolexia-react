/**
 * Empty Vocabulary - Shown when no words are saved
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface EmptyVocabularyProps {
  hasFilter: boolean;
}

export function EmptyVocabulary({hasFilter}: EmptyVocabularyProps): React.JSX.Element {
  if (hasFilter) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🔍</Text>
        <Text style={styles.title}>No Matches Found</Text>
        <Text style={styles.description}>
          Try adjusting your search or filters to find the words you're looking for.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📝</Text>
      <Text style={styles.title}>No Words Saved Yet</Text>
      <Text style={styles.description}>
        As you read, tap on foreign words and save them to build your vocabulary list.
        You'll be able to review them here using spaced repetition.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
