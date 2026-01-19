/**
 * Translation Popup - Shows original word when foreign word is tapped
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import type {ForeignWordData} from '@types/index';
import {useVocabularyStore} from '@stores/vocabularyStore';
import {useStatisticsStore} from '@stores/statisticsStore';

interface TranslationPopupProps {
  word: ForeignWordData;
  onDismiss: () => void;
}

const {width, height} = Dimensions.get('window');

export function TranslationPopup({word, onDismiss}: TranslationPopupProps): React.JSX.Element {
  const {addWord} = useVocabularyStore();
  const {recordWordRevealed, recordWordSaved} = useStatisticsStore();

  // Record that word was revealed
  React.useEffect(() => {
    recordWordRevealed();
  }, [recordWordRevealed]);

  const handleSaveWord = () => {
    addWord({
      id: Date.now().toString(),
      sourceWord: word.originalWord,
      targetWord: word.foreignWord,
      sourceLanguage: word.wordEntry.sourceLanguage,
      targetLanguage: word.wordEntry.targetLanguage,
      contextSentence: null, // TODO: Extract from book content
      bookId: null, // TODO: Get from reader context
      bookTitle: null,
      addedAt: new Date(),
      lastReviewedAt: null,
      reviewCount: 0,
      easeFactor: 2.5,
      interval: 0,
      status: 'new',
    });
    recordWordSaved();
    onDismiss();
  };

  const handleKnewIt = () => {
    // User knew the word - don't save but record interaction
    onDismiss();
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <View style={styles.container}>
          <Pressable style={styles.popup} onPress={e => e.stopPropagation()}>
            {/* Foreign Word */}
            <Text style={styles.foreignWord}>{word.foreignWord}</Text>

            {/* Pronunciation (if available) */}
            {word.wordEntry.pronunciation && (
              <Text style={styles.pronunciation}>[{word.wordEntry.pronunciation}]</Text>
            )}

            {/* Part of Speech */}
            <Text style={styles.partOfSpeech}>{word.wordEntry.partOfSpeech}</Text>

            {/* Original Word */}
            <View style={styles.divider} />
            <Text style={styles.originalWord}>{word.originalWord}</Text>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.knewButton]}
                onPress={handleKnewIt}>
                <Text style={styles.knewButtonText}>I knew this ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveWord}>
                <Text style={styles.saveButtonText}>Save word +</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 320,
  },
  popup: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  foreignWord: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 4,
  },
  pronunciation: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'lowercase',
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  originalWord: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  knewButton: {
    backgroundColor: '#f3f4f6',
  },
  knewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
