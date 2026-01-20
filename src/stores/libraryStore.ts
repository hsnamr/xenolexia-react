/**
 * Library Store - Manages book collection with database persistence
 */

import {create} from 'zustand';

import type {Book} from '@/types';
import {bookRepository} from '@services/StorageService/repositories';
import type {BookFilter, BookSort} from '@services/StorageService/repositories';

// ============================================================================
// Types
// ============================================================================

interface LibraryState {
  // State
  books: Book[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  currentFilter: BookFilter | null;
  currentSort: BookSort;

  // Basic Actions
  addBook: (book: Book) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
  updateBook: (bookId: string, updates: Partial<Book>) => Promise<void>;
  getBook: (bookId: string) => Book | undefined;

  // Data Loading
  initialize: () => Promise<void>;
  refreshBooks: () => Promise<void>;
  loadBooks: (filter?: BookFilter, sort?: BookSort) => Promise<void>;
  searchBooks: (query: string) => Promise<void>;

  // Progress tracking
  updateProgress: (
    bookId: string,
    progress: number,
    location: string | null,
    chapter?: number,
    page?: number,
  ) => Promise<void>;
  updateReadingTime: (bookId: string, minutes: number) => Promise<void>;

  // Filtering & Sorting
  setFilter: (filter: BookFilter | null) => void;
  setSort: (sort: BookSort) => void;

  // State setters
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_SORT: BookSort = {
  by: 'lastReadAt',
  order: 'desc',
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useLibraryStore = create<LibraryState>((set, get) => ({
  // Initial state
  books: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  currentFilter: null,
  currentSort: DEFAULT_SORT,

  // ============================================================================
  // Initialization
  // ============================================================================

  initialize: async () => {
    const state = get();
    if (state.isInitialized) return;

    set({isLoading: true, error: null});

    try {
      const books = await bookRepository.getAll(state.currentSort);
      set({
        books,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('[LibraryStore] Failed to initialize:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load library',
        isLoading: false,
        isInitialized: true, // Mark as initialized even on error
      });
    }
  },

  // ============================================================================
  // Basic CRUD Operations
  // ============================================================================

  addBook: async (book: Book) => {
    try {
      // Add to database first
      await bookRepository.add(book);

      // Update local state
      set(state => ({
        books: [book, ...state.books],
      }));
    } catch (error) {
      console.error('[LibraryStore] Failed to add book:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to add book',
      });
      throw error;
    }
  },

  removeBook: async (bookId: string) => {
    try {
      // Remove from database first
      await bookRepository.delete(bookId);

      // Update local state
      set(state => ({
        books: state.books.filter(b => b.id !== bookId),
      }));
    } catch (error) {
      console.error('[LibraryStore] Failed to remove book:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to remove book',
      });
      throw error;
    }
  },

  updateBook: async (bookId: string, updates: Partial<Book>) => {
    try {
      // Update in database first
      await bookRepository.update(bookId, updates);

      // Update local state
      set(state => ({
        books: state.books.map(book =>
          book.id === bookId ? {...book, ...updates} : book,
        ),
      }));
    } catch (error) {
      console.error('[LibraryStore] Failed to update book:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update book',
      });
      throw error;
    }
  },

  getBook: (bookId: string) => {
    return get().books.find(b => b.id === bookId);
  },

  // ============================================================================
  // Data Loading
  // ============================================================================

  refreshBooks: async () => {
    const state = get();
    set({isLoading: true, error: null});

    try {
      let books: Book[];

      if (state.currentFilter) {
        books = await bookRepository.getFiltered(
          state.currentFilter,
          state.currentSort,
        );
      } else {
        books = await bookRepository.getAll(state.currentSort);
      }

      set({books, isLoading: false});
    } catch (error) {
      console.error('[LibraryStore] Failed to refresh books:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load books',
        isLoading: false,
      });
    }
  },

  loadBooks: async (filter?: BookFilter, sort?: BookSort) => {
    const currentSort = sort ?? get().currentSort;
    set({isLoading: true, error: null, currentFilter: filter ?? null});

    try {
      let books: Book[];

      if (filter) {
        books = await bookRepository.getFiltered(filter, currentSort);
      } else {
        books = await bookRepository.getAll(currentSort);
      }

      set({books, isLoading: false, currentSort});
    } catch (error) {
      console.error('[LibraryStore] Failed to load books:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load books',
        isLoading: false,
      });
    }
  },

  searchBooks: async (query: string) => {
    if (!query.trim()) {
      return get().refreshBooks();
    }

    set({isLoading: true, error: null});

    try {
      const books = await bookRepository.search(query);
      set({books, isLoading: false});
    } catch (error) {
      console.error('[LibraryStore] Failed to search books:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to search books',
        isLoading: false,
      });
    }
  },

  // ============================================================================
  // Progress Tracking
  // ============================================================================

  updateProgress: async (
    bookId: string,
    progress: number,
    location: string | null,
    chapter?: number,
    page?: number,
  ) => {
    try {
      // Update in database
      await bookRepository.updateProgress(bookId, progress, location, chapter, page);

      // Update local state
      set(state => ({
        books: state.books.map(book =>
          book.id === bookId
            ? {
                ...book,
                progress: Math.min(100, Math.max(0, progress)),
                currentLocation: location,
                currentChapter: chapter ?? book.currentChapter,
                currentPage: page ?? book.currentPage,
                lastReadAt: new Date(),
              }
            : book,
        ),
      }));
    } catch (error) {
      console.error('[LibraryStore] Failed to update progress:', error);
      // Don't set error for progress updates - they're not critical
    }
  },

  updateReadingTime: async (bookId: string, minutes: number) => {
    try {
      // Update in database
      await bookRepository.addReadingTime(bookId, minutes);

      // Update local state
      set(state => ({
        books: state.books.map(book =>
          book.id === bookId
            ? {
                ...book,
                readingTimeMinutes: book.readingTimeMinutes + minutes,
                lastReadAt: new Date(),
              }
            : book,
        ),
      }));
    } catch (error) {
      console.error('[LibraryStore] Failed to update reading time:', error);
    }
  },

  // ============================================================================
  // Filtering & Sorting
  // ============================================================================

  setFilter: (filter: BookFilter | null) => {
    set({currentFilter: filter});
    get().refreshBooks();
  },

  setSort: (sort: BookSort) => {
    set({currentSort: sort});
    get().refreshBooks();
  },

  // ============================================================================
  // State Setters
  // ============================================================================

  setLoading: (loading: boolean) => {
    set({isLoading: loading});
  },

  setError: (error: string | null) => {
    set({error});
  },

  clearError: () => {
    set({error: null});
  },
}));

// ============================================================================
// Selectors
// ============================================================================

/**
 * Get books currently in progress
 */
export const selectBooksInProgress = (state: LibraryState) =>
  state.books.filter(book => book.progress > 0 && book.progress < 100);

/**
 * Get completed books
 */
export const selectCompletedBooks = (state: LibraryState) =>
  state.books.filter(book => book.progress >= 100);

/**
 * Get recently added books
 */
export const selectRecentlyAdded = (state: LibraryState, limit: number = 5) =>
  [...state.books]
    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
    .slice(0, limit);

/**
 * Get recently read books
 */
export const selectRecentlyRead = (state: LibraryState, limit: number = 5) =>
  [...state.books]
    .filter(book => book.lastReadAt !== null)
    .sort((a, b) => (b.lastReadAt?.getTime() ?? 0) - (a.lastReadAt?.getTime() ?? 0))
    .slice(0, limit);
