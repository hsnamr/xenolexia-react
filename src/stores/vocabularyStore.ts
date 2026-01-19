/**
 * Vocabulary Store - Manages saved words and SRS
 */

import {create} from 'zustand';
import type {VocabularyItem, VocabularyStatus} from '@types/index';

interface VocabularyState {
  vocabulary: VocabularyItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addWord: (word: VocabularyItem) => void;
  removeWord: (wordId: string) => void;
  updateWord: (wordId: string, updates: Partial<VocabularyItem>) => void;
  updateWordStatus: (wordId: string, status: VocabularyStatus) => void;
  getWord: (wordId: string) => VocabularyItem | undefined;
  getDueForReview: () => VocabularyItem[];
  recordReview: (wordId: string, quality: number) => void;
  refreshVocabulary: () => Promise<void>;
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  vocabulary: [],
  isLoading: false,
  error: null,

  addWord: (word: VocabularyItem) => {
    set(state => ({
      vocabulary: [...state.vocabulary, word],
    }));
  },

  removeWord: (wordId: string) => {
    set(state => ({
      vocabulary: state.vocabulary.filter(w => w.id !== wordId),
    }));
  },

  updateWord: (wordId: string, updates: Partial<VocabularyItem>) => {
    set(state => ({
      vocabulary: state.vocabulary.map(word =>
        word.id === wordId ? {...word, ...updates} : word,
      ),
    }));
  },

  updateWordStatus: (wordId: string, status: VocabularyStatus) => {
    get().updateWord(wordId, {status});
  },

  getWord: (wordId: string) => {
    return get().vocabulary.find(w => w.id === wordId);
  },

  getDueForReview: () => {
    const now = new Date();
    return get().vocabulary.filter(word => {
      if (word.status === 'learned') return false;
      if (!word.lastReviewedAt) return true;

      const nextReviewDate = new Date(word.lastReviewedAt);
      nextReviewDate.setDate(nextReviewDate.getDate() + word.interval);
      return nextReviewDate <= now;
    });
  },

  recordReview: (wordId: string, quality: number) => {
    // Implement SM-2 algorithm for spaced repetition
    const word = get().getWord(wordId);
    if (!word) return;

    let {easeFactor, interval, reviewCount} = word;

    // SM-2 algorithm
    if (quality >= 3) {
      // Correct response
      if (reviewCount === 0) {
        interval = 1;
      } else if (reviewCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      reviewCount += 1;
    } else {
      // Incorrect response - reset
      reviewCount = 0;
      interval = 1;
    }

    // Update ease factor
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );

    // Determine new status
    let status: VocabularyStatus = 'learning';
    if (interval >= 21) {
      status = 'learned';
    } else if (reviewCount === 0) {
      status = 'new';
    }

    get().updateWord(wordId, {
      easeFactor,
      interval,
      reviewCount,
      status,
      lastReviewedAt: new Date(),
    });
  },

  refreshVocabulary: async () => {
    set({isLoading: true, error: null});
    try {
      // TODO: Load vocabulary from SQLite database
      // const vocabulary = await StorageService.getAllVocabulary();
      // set({ vocabulary, isLoading: false });
      set({isLoading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load vocabulary',
        isLoading: false,
      });
    }
  },
}));
