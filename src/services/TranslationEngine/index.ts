/**
 * Translation Engine - Core word replacement logic
 */

// Main engine and matcher
export { TranslationEngine } from './TranslationEngine';
export { WordMatcher } from './WordMatcher';

// Word database
export {
  WordDatabaseService,
  wordDatabase,
  PROFICIENCY_RANKS,
  getProficiencyFromRank,
} from './WordDatabase';
export type {
  WordDatabaseEntry,
  WordLookupOptions,
  WordDatabaseStats,
  BulkImportResult,
} from './WordDatabase';

// Types
export type {
  TranslationOptions,
  ProcessedText,
  ProcessingStats,
  WordMatch,
} from './types';
