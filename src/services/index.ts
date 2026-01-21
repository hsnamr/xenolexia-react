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

export {ImportService, SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES} from './ImportService';
export type {
  ImportProgress,
  ImportResult,
  ImportOptions,
  SelectedFile,
  CopiedFileInfo,
  ImportedBookMetadata,
  ImportStatus,
} from './ImportService';

export {ImageService, ImageCache, ThumbnailGenerator, THUMBNAIL_SIZES} from './ImageService';
export type {
  ImageDimensions,
  ResizeOptions,
  ThumbnailOptions,
  ThumbnailSize,
  CacheEntry,
  CacheStats,
  CacheOptions,
  ImageLoadStatus,
  ImageLoadResult,
  ImageSource,
  PlaceholderType,
  PlaceholderOptions,
} from './ImageService';

export {
  ReaderStyleService,
  READER_FONTS,
  READER_THEMES,
  generateStylesheet,
  saveSettings,
  loadSettings,
  saveBookSettings,
  loadBookSettings,
} from './ReaderStyleService';
export type {
  ReaderStyleConfig,
  ThemeColors,
} from './ReaderStyleService';
