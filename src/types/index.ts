/**
 * Central type definitions for Xenolexia
 */

// ============================================================================
// Language & Proficiency Types
// ============================================================================

export type Language =
  | 'en' // English
  | 'el' // Greek
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'ru' // Russian
  | 'ja' // Japanese
  | 'zh' // Chinese
  | 'ko' // Korean
  | 'ar'; // Arabic

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LanguagePair {
  sourceLanguage: Language;
  targetLanguage: Language;
}

// ============================================================================
// Book Types
// ============================================================================

export type BookFormat = 'epub' | 'fb2' | 'mobi' | 'txt';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverPath: string | null;
  filePath: string;
  format: BookFormat;
  fileSize: number; // in bytes
  addedAt: Date;
  lastReadAt: Date | null;
  languagePair: LanguagePair;
  proficiencyLevel: ProficiencyLevel;
  wordDensity: number; // 0.0 - 1.0

  // Reading Progress
  progress: number; // 0-100 percentage
  currentLocation: string | null; // CFI for EPUB, chapter index otherwise
  currentChapter: number; // Current chapter index
  totalChapters: number; // Total number of chapters
  currentPage: number; // Estimated current page
  totalPages: number; // Estimated total pages
  readingTimeMinutes: number; // Total reading time in minutes

  // Download/Source info
  sourceUrl?: string; // Original download URL if downloaded
  isDownloaded: boolean; // Whether the file is stored locally
}

export interface BookMetadata {
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  language?: string;
  publisher?: string;
  publishDate?: string;
  isbn?: string;
}

export interface Chapter {
  id: string;
  title: string;
  index: number;
  content: string; // HTML or plain text
  wordCount: number;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  href: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface ParsedBook {
  metadata: BookMetadata;
  chapters: Chapter[];
  tableOfContents: TableOfContentsItem[];
  totalWordCount: number;
}

// ============================================================================
// Word & Vocabulary Types
// ============================================================================

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'article'
  | 'other';

export interface WordEntry {
  id: string;
  sourceWord: string;
  targetWord: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  proficiencyLevel: ProficiencyLevel;
  frequencyRank: number;
  partOfSpeech: PartOfSpeech;
  variants: string[]; // Alternative forms (plurals, conjugations)
  pronunciation?: string; // IPA or transliteration
}

export interface VocabularyItem {
  id: string;
  sourceWord: string;
  targetWord: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  contextSentence: string | null;
  bookId: string | null;
  bookTitle: string | null;
  addedAt: Date;
  lastReviewedAt: Date | null;
  reviewCount: number;
  easeFactor: number; // SM-2 algorithm
  interval: number; // Days until next review
  status: VocabularyStatus;
}

export type VocabularyStatus = 'new' | 'learning' | 'review' | 'learned';

// ============================================================================
// Reader Types
// ============================================================================

export type ReaderTheme = 'light' | 'dark' | 'sepia';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontFamily: string;
  fontSize: number; // in sp/pt
  lineHeight: number; // multiplier
  marginHorizontal: number; // in dp/pt
  marginVertical: number; // in dp/pt
  textAlign: 'left' | 'justify';
  brightness: number; // 0.0 - 1.0
}

export interface ForeignWordData {
  originalWord: string;
  foreignWord: string;
  startIndex: number;
  endIndex: number;
  wordEntry: WordEntry;
}

export interface ProcessedChapter extends Chapter {
  foreignWords: ForeignWordData[];
  processedContent: string; // HTML with foreign words marked
}

// ============================================================================
// Reading Session & Statistics
// ============================================================================

export interface ReadingSession {
  id: string;
  bookId: string;
  startedAt: Date;
  endedAt: Date | null;
  pagesRead: number;
  wordsRevealed: number;
  wordsSaved: number;
  duration: number; // in seconds
}

export interface ReadingStats {
  totalBooksRead: number;
  totalReadingTime: number; // in seconds
  totalWordsLearned: number;
  currentStreak: number; // days
  longestStreak: number;
  averageSessionDuration: number;
  wordsRevealedToday: number;
  wordsSavedToday: number;
}

// ============================================================================
// Navigation Types
// ============================================================================

export type RootStackParamList = {
  MainTabs: undefined;
  Reader: {bookId: string};
  BookDetail: {bookId: string};
  BookDiscovery: undefined;
  VocabularyDetail: {wordId: string};
  Settings: undefined;
  LanguageSettings: undefined;
  Onboarding: undefined;
};

export type MainTabsParamList = {
  Library: undefined;
  Vocabulary: undefined;
  Statistics: undefined;
  Profile: undefined;
};

// ============================================================================
// App State Types
// ============================================================================

export interface UserPreferences {
  defaultSourceLanguage: Language;
  defaultTargetLanguage: Language;
  defaultProficiencyLevel: ProficiencyLevel;
  defaultWordDensity: number;
  readerSettings: ReaderSettings;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  dailyGoal: number; // minutes
}

export interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  currentBook: Book | null;
  preferences: UserPreferences;
}
