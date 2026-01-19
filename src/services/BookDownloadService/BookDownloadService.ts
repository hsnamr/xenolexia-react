/**
 * Book Download Service
 *
 * Handles downloading ebooks from various sources and managing local files.
 * Supports: Project Gutenberg, Standard Ebooks, Open Library, and direct URLs.
 */

// import RNFS from 'react-native-fs';
import type {BookFormat} from '@types/index';

import type {
  DownloadProgress,
  DownloadResult,
  EbookSource,
  EbookSearchResult,
  LocalEbookFile,
} from './types';

// Directory for storing downloaded books
// const BOOKS_DIRECTORY = `${RNFS.DocumentDirectoryPath}/books`;

/**
 * Supported ebook sources
 */
export const EBOOK_SOURCES: EbookSource[] = [
  {
    type: 'local',
    name: 'Device Storage',
    searchEnabled: false,
    downloadEnabled: false,
  },
  {
    type: 'gutenberg',
    name: 'Project Gutenberg',
    baseUrl: 'https://www.gutenberg.org',
    searchEnabled: true,
    downloadEnabled: true,
  },
  {
    type: 'standardebooks',
    name: 'Standard Ebooks',
    baseUrl: 'https://standardebooks.org',
    searchEnabled: true,
    downloadEnabled: true,
  },
  {
    type: 'openlibrary',
    name: 'Open Library',
    baseUrl: 'https://openlibrary.org',
    searchEnabled: true,
    downloadEnabled: true,
  },
  {
    type: 'url',
    name: 'Direct URL',
    searchEnabled: false,
    downloadEnabled: true,
  },
];

export class BookDownloadService {
  private static downloadProgress: Map<string, DownloadProgress> = new Map();
  private static progressListeners: Map<string, (progress: DownloadProgress) => void> = new Map();

  /**
   * Initialize the books directory
   */
  static async initialize(): Promise<void> {
    try {
      // TODO: Create books directory if it doesn't exist
      // const exists = await RNFS.exists(BOOKS_DIRECTORY);
      // if (!exists) {
      //   await RNFS.mkdir(BOOKS_DIRECTORY);
      // }
      console.log('BookDownloadService initialized');
    } catch (error) {
      console.error('Failed to initialize BookDownloadService:', error);
      throw error;
    }
  }

  /**
   * Download an ebook from a URL
   */
  static async downloadFromUrl(
    url: string,
    bookId: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<DownloadResult> {
    try {
      // Initialize progress
      const progress: DownloadProgress = {
        bookId,
        bytesDownloaded: 0,
        totalBytes: 0,
        percentage: 0,
        status: 'pending',
      };

      this.downloadProgress.set(bookId, progress);
      if (onProgress) {
        this.progressListeners.set(bookId, onProgress);
      }

      // Determine format from URL
      const format = this.detectFormat(url);
      if (!format) {
        return {
          success: false,
          error: 'Unsupported file format',
        };
      }

      // Generate filename
      const filename = `${bookId}.${format}`;
      // const destPath = `${BOOKS_DIRECTORY}/${filename}`;

      // Update progress to downloading
      progress.status = 'downloading';
      onProgress?.(progress);

      // TODO: Implement actual download using RNFS
      // const download = RNFS.downloadFile({
      //   fromUrl: url,
      //   toFile: destPath,
      //   progress: (res) => {
      //     progress.bytesDownloaded = res.bytesWritten;
      //     progress.totalBytes = res.contentLength;
      //     progress.percentage = Math.round((res.bytesWritten / res.contentLength) * 100);
      //     onProgress?.(progress);
      //   },
      // });
      //
      // const result = await download.promise;

      // Placeholder success result
      progress.status = 'completed';
      progress.percentage = 100;
      onProgress?.(progress);

      return {
        success: true,
        filePath: `/books/${filename}`, // Placeholder path
        format,
        metadata: {
          title: 'Downloaded Book',
          author: 'Unknown',
          fileSize: 0,
        },
      };
    } catch (error) {
      const progress = this.downloadProgress.get(bookId);
      if (progress) {
        progress.status = 'failed';
        progress.error = error instanceof Error ? error.message : 'Download failed';
        this.progressListeners.get(bookId)?.(progress);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed',
      };
    } finally {
      this.downloadProgress.delete(bookId);
      this.progressListeners.delete(bookId);
    }
  }

  /**
   * Search for ebooks from online sources
   */
  static async searchBooks(
    query: string,
    source: EbookSource['type'] = 'gutenberg'
  ): Promise<EbookSearchResult[]> {
    try {
      switch (source) {
        case 'gutenberg':
          return await this.searchGutenberg(query);
        case 'standardebooks':
          return await this.searchStandardEbooks(query);
        case 'openlibrary':
          return await this.searchOpenLibrary(query);
        default:
          return [];
      }
    } catch (error) {
      console.error(`Search failed for ${source}:`, error);
      return [];
    }
  }

  /**
   * Search Project Gutenberg
   */
  private static async searchGutenberg(query: string): Promise<EbookSearchResult[]> {
    // TODO: Implement Gutenberg API search
    // API: https://gutendex.com/books/?search=query
    console.log('Searching Gutenberg for:', query);
    return [];
  }

  /**
   * Search Standard Ebooks
   */
  private static async searchStandardEbooks(query: string): Promise<EbookSearchResult[]> {
    // TODO: Implement Standard Ebooks search
    // Feed: https://standardebooks.org/opds
    console.log('Searching Standard Ebooks for:', query);
    return [];
  }

  /**
   * Search Open Library
   */
  private static async searchOpenLibrary(query: string): Promise<EbookSearchResult[]> {
    // TODO: Implement Open Library API search
    // API: https://openlibrary.org/search.json?q=query
    console.log('Searching Open Library for:', query);
    return [];
  }

  /**
   * Get list of locally stored ebooks
   */
  static async getLocalBooks(): Promise<LocalEbookFile[]> {
    try {
      // TODO: Implement using RNFS
      // const files = await RNFS.readDir(BOOKS_DIRECTORY);
      // return files
      //   .filter(file => this.isSupportedFormat(file.name))
      //   .map(file => ({
      //     path: file.path,
      //     name: file.name,
      //     size: file.size,
      //     format: this.detectFormat(file.name)!,
      //     lastModified: new Date(file.mtime),
      //   }));
      return [];
    } catch (error) {
      console.error('Failed to get local books:', error);
      return [];
    }
  }

  /**
   * Delete a locally stored ebook
   */
  static async deleteLocalBook(filePath: string): Promise<boolean> {
    try {
      // TODO: Implement using RNFS
      // await RNFS.unlink(filePath);
      console.log('Deleting book:', filePath);
      return true;
    } catch (error) {
      console.error('Failed to delete book:', error);
      return false;
    }
  }

  /**
   * Get total storage used by books
   */
  static async getStorageUsed(): Promise<number> {
    try {
      const books = await this.getLocalBooks();
      return books.reduce((total, book) => total + book.size, 0);
    } catch (error) {
      console.error('Failed to calculate storage:', error);
      return 0;
    }
  }

  /**
   * Cancel an ongoing download
   */
  static cancelDownload(bookId: string): void {
    const progress = this.downloadProgress.get(bookId);
    if (progress) {
      progress.status = 'cancelled';
      this.progressListeners.get(bookId)?.(progress);
      this.downloadProgress.delete(bookId);
      this.progressListeners.delete(bookId);
    }
  }

  /**
   * Detect book format from filename or URL
   */
  static detectFormat(pathOrUrl: string): BookFormat | null {
    const lower = pathOrUrl.toLowerCase();
    if (lower.endsWith('.epub')) return 'epub';
    if (lower.endsWith('.fb2')) return 'fb2';
    if (lower.endsWith('.mobi') || lower.endsWith('.azw') || lower.endsWith('.azw3')) return 'mobi';
    if (lower.endsWith('.txt')) return 'txt';
    return null;
  }

  /**
   * Check if a file format is supported
   */
  static isSupportedFormat(filename: string): boolean {
    return this.detectFormat(filename) !== null;
  }
}
