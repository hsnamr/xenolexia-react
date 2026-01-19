/**
 * Export all services
 */

export {BookParserService, EPUBParser} from './BookParser';
export type {IBookParser} from './BookParser';

export {TranslationEngine, WordMatcher} from './TranslationEngine';
export type {TranslationOptions, ProcessedText} from './TranslationEngine';

export {StorageService, DatabaseSchema} from './StorageService';

export {BookDownloadService, EBOOK_SOURCES} from './BookDownloadService';
export type {
  DownloadProgress,
  DownloadResult,
  EbookSource,
  EbookSearchResult,
  LocalEbookFile,
} from './BookDownloadService';
