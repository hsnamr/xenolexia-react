/**
 * Reader Store - Manages reading state and content processing
 */

import {create} from 'zustand';
import type {Book, Chapter, ForeignWordData, ReaderSettings, ProcessedChapter} from '@types/index';

interface ReaderState {
  // Current book state
  currentBook: Book | null;
  chapters: Chapter[];
  currentChapterIndex: number;
  currentChapter: Chapter | null;
  
  // Processed content
  processedContent: string;
  foreignWords: ForeignWordData[];
  
  // Reader settings (local copy for the current session)
  settings: ReaderSettings & {
    targetLanguage?: string;
    proficiencyLevel?: string;
    wordDensity?: number;
  };
  
  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  loadBook: (book: Book) => Promise<void>;
  goToChapter: (index: number) => Promise<void>;
  goToNextChapter: () => void;
  goToPreviousChapter: () => void;
  updateSettings: (settings: Partial<ReaderState['settings']>) => void;
  updateProgress: (progress: number) => void;
  processChapter: (chapter: Chapter) => Promise<ProcessedChapter>;
  closeBook: () => void;
}

const defaultSettings: ReaderState['settings'] = {
  theme: 'light',
  fontFamily: 'Georgia',
  fontSize: 18,
  lineHeight: 1.6,
  marginHorizontal: 24,
  marginVertical: 24,
  textAlign: 'left',
  brightness: 1.0,
  targetLanguage: 'el',
  proficiencyLevel: 'beginner',
  wordDensity: 0.3,
};

export const useReaderStore = create<ReaderState>((set, get) => ({
  currentBook: null,
  chapters: [],
  currentChapterIndex: 0,
  currentChapter: null,
  processedContent: '',
  foreignWords: [],
  settings: defaultSettings,
  isLoading: false,
  error: null,

  loadBook: async (book: Book) => {
    set({isLoading: true, error: null, currentBook: book});
    
    try {
      // TODO: Parse book using BookParser service
      // const parsedBook = await BookParserService.parse(book.filePath);
      // set({
      //   chapters: parsedBook.chapters,
      //   isLoading: false,
      // });
      
      // For now, set placeholder content
      const placeholderChapter: Chapter = {
        id: '1',
        title: 'Chapter 1',
        index: 0,
        content: 'Welcome to your book! Import an EPUB to start reading.',
        wordCount: 10,
      };
      
      set({
        chapters: [placeholderChapter],
        currentChapter: placeholderChapter,
        currentChapterIndex: 0,
        isLoading: false,
        settings: {
          ...get().settings,
          targetLanguage: book.languagePair.targetLanguage,
          proficiencyLevel: book.proficiencyLevel,
          wordDensity: book.wordDensity,
        },
      });
      
      // Process the first chapter
      await get().goToChapter(0);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load book',
        isLoading: false,
      });
    }
  },

  goToChapter: async (index: number) => {
    const {chapters} = get();
    
    if (index < 0 || index >= chapters.length) {
      return;
    }
    
    set({isLoading: true});
    
    try {
      const chapter = chapters[index];
      const processed = await get().processChapter(chapter);
      
      set({
        currentChapterIndex: index,
        currentChapter: chapter,
        processedContent: processed.processedContent,
        foreignWords: processed.foreignWords,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load chapter',
        isLoading: false,
      });
    }
  },

  goToNextChapter: () => {
    const {currentChapterIndex, chapters} = get();
    if (currentChapterIndex < chapters.length - 1) {
      get().goToChapter(currentChapterIndex + 1);
    }
  },

  goToPreviousChapter: () => {
    const {currentChapterIndex} = get();
    if (currentChapterIndex > 0) {
      get().goToChapter(currentChapterIndex - 1);
    }
  },

  updateSettings: (settings: Partial<ReaderState['settings']>) => {
    set(state => ({
      settings: {...state.settings, ...settings},
    }));
  },

  updateProgress: (progress: number) => {
    const {currentBook} = get();
    if (currentBook) {
      // TODO: Update progress in library store and database
      set(state => ({
        currentBook: state.currentBook ? {...state.currentBook, progress} : null,
      }));
    }
  },

  processChapter: async (chapter: Chapter): Promise<ProcessedChapter> => {
    // TODO: Implement actual word replacement using TranslationEngine
    // const processed = await TranslationEngine.processContent(
    //   chapter.content,
    //   get().settings
    // );
    
    // Placeholder implementation
    return {
      ...chapter,
      foreignWords: [],
      processedContent: chapter.content,
    };
  },

  closeBook: () => {
    set({
      currentBook: null,
      chapters: [],
      currentChapterIndex: 0,
      currentChapter: null,
      processedContent: '',
      foreignWords: [],
    });
  },
}));
