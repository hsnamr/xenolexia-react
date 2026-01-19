/**
 * Library Store - Manages book collection
 */

import {create} from 'zustand';
import type {Book} from '@types/index';

interface LibraryState {
  books: Book[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  updateBook: (bookId: string, updates: Partial<Book>) => void;
  getBook: (bookId: string) => Book | undefined;
  refreshBooks: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  books: [],
  isLoading: false,
  error: null,

  addBook: (book: Book) => {
    set(state => ({
      books: [...state.books, book],
    }));
  },

  removeBook: (bookId: string) => {
    set(state => ({
      books: state.books.filter(b => b.id !== bookId),
    }));
  },

  updateBook: (bookId: string, updates: Partial<Book>) => {
    set(state => ({
      books: state.books.map(book =>
        book.id === bookId ? {...book, ...updates} : book,
      ),
    }));
  },

  getBook: (bookId: string) => {
    return get().books.find(b => b.id === bookId);
  },

  refreshBooks: async () => {
    set({isLoading: true, error: null});
    try {
      // TODO: Load books from SQLite database
      // const books = await StorageService.getAllBooks();
      // set({ books, isLoading: false });
      set({isLoading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load books',
        isLoading: false,
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({isLoading: loading});
  },
}));
