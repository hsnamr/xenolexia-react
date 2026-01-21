# Week 2: Book Import & Library - Daily Breakdown

## Overview

Week 2 focuses on implementing the book import functionality, EPUB parsing, and enhancing the Library screen with proper storage.

---

## Day 1: Document Picker & File Import 📂 ✅

**Goal:** Enable users to import EPUB files from their device.
**Status:** COMPLETED

### Tasks

- [x] Implement document picker integration
- [x] Handle file selection for EPUB/supported formats
- [x] Copy imported files to app's document directory
- [x] Create ImportService for handling file operations
- [x] Add import progress indicator
- [x] Handle import errors gracefully
- [x] Update ImportBookButton to use real file picker

### Deliverables

- ✅ Users can tap "Import Book" and select EPUB/TXT/MOBI/FB2 files
- ✅ Files are copied to app's document directory (`/books/{bookId}/`)
- ✅ Import progress modal with status, progress bar, and cancel option
- ✅ Error handling with user-friendly messages
- ✅ Automatic book addition to library store after import

### Files Created/Updated

- `src/services/ImportService/types.ts` - Import types and constants
- `src/services/ImportService/ImportService.ts` - Document picker, file copy, metadata stub
- `src/services/ImportService/index.ts` - Service exports
- `src/components/library/ImportProgressModal.tsx` - Progress UI component
- `src/components/library/ImportBookButton.tsx` - Updated with real import flow
- `src/services/index.ts` - Added ImportService exports

---

## Day 2: EPUB Metadata Parsing 📖 ✅

**Goal:** Extract book metadata from EPUB files.
**Status:** COMPLETED

### Tasks

- [x] Implement EPUB package.opf parsing
- [x] Extract title, author, description
- [x] Extract language and publisher info
- [x] Parse table of contents (toc.ncx/nav.xhtml)
- [x] Handle different EPUB versions (2.0, 3.0)
- [x] Create metadata extraction utilities
- [x] Update ImportService to use real parsing
- [x] Extract cover images from EPUB

### Deliverables

- ✅ EPUB files are parsed for metadata using JSZip
- ✅ Title, author, description, publisher, ISBN extracted
- ✅ Table of contents structure parsed (NCX for EPUB 2, NAV for EPUB 3)
- ✅ Support for EPUB 2.0 and 3.0
- ✅ Cover image extraction and storage
- ✅ MetadataExtractor high-level API

### Files Created/Updated

- `src/services/BookParser/EPUBExtractor.ts` - Low-level ZIP/XML parsing
- `src/services/BookParser/TOCParser.ts` - NCX and NAV parsing
- `src/services/BookParser/MetadataExtractor.ts` - High-level metadata API
- `src/services/BookParser/EPUBParser.ts` - Updated to use real parsing
- `src/services/BookParser/index.ts` - Updated exports
- `src/services/ImportService/ImportService.ts` - Uses MetadataExtractor
- `src/services/ImportService/types.ts` - Added subjects field
- `src/types/index.ts` - Added subjects to BookMetadata

---

## Day 3: Image Service & Thumbnails 🖼️ ✅

**Goal:** Create image service for thumbnails and caching.
**Status:** COMPLETED

> Note: Basic cover extraction was completed in Day 2 as part of MetadataExtractor.

### Tasks

- [x] Create ImageService for image operations
- [x] Generate thumbnails for grid view performance
- [x] Implement image caching with memory/disk layers
- [x] Create BookCover component with loading states
- [x] Implement placeholder for books without covers
- [x] Create skeleton loading components

### Deliverables

- ✅ ImageService with download, cache, and placeholder capabilities
- ✅ ThumbnailGenerator with size presets (small, medium, large)
- ✅ ImageCache with LRU memory cache + disk persistence
- ✅ BookCover component with fade-in animation and initials fallback
- ✅ BookCoverSkeleton and BookCoverGridSkeleton for loading states
- ✅ Updated BookCard to use new BookCover component

### Files Created/Updated

- `src/services/ImageService/types.ts` - Image, cache, and thumbnail types
- `src/services/ImageService/ImageCache.ts` - Two-layer caching (memory + disk)
- `src/services/ImageService/ThumbnailGenerator.ts` - Thumbnail generation
- `src/services/ImageService/ImageService.ts` - Main image service
- `src/services/ImageService/index.ts` - Service exports
- `src/services/index.ts` - Added ImageService exports
- `src/components/library/BookCover.tsx` - Cover display with loading states
- `src/components/library/BookCard.tsx` - Updated to use BookCover
- `src/components/library/index.ts` - Component exports

---

## Day 4: SQLite Database Implementation 💾 ✅

**Goal:** Persist book data in SQLite database.
**Status:** COMPLETED

### Tasks

- [x] Implement SQLite connection and initialization
- [x] Create books table schema with migrations
- [x] Implement CRUD operations for books (BookRepository)
- [x] Add vocabulary and reading sessions repositories
- [x] Implement database migrations system
- [x] Connect libraryStore to database
- [x] Add SM-2 spaced repetition in VocabularyRepository
- [x] Add reading streak calculation in SessionRepository

### Deliverables

- ✅ DatabaseService with SQLite connection and migrations
- ✅ BookRepository with full CRUD, filtering, sorting, search
- ✅ VocabularyRepository with SRS review support
- ✅ SessionRepository with streak calculation and statistics
- ✅ libraryStore connected to database with async operations
- ✅ Selectors for in-progress, completed, recently read books

### Files Created/Updated

- `src/services/StorageService/DatabaseService.ts` - SQLite connection, migrations, query helpers
- `src/services/StorageService/repositories/BookRepository.ts` - Book CRUD and queries
- `src/services/StorageService/repositories/VocabularyRepository.ts` - Vocabulary with SRS
- `src/services/StorageService/repositories/SessionRepository.ts` - Sessions and statistics
- `src/services/StorageService/repositories/index.ts` - Repository exports
- `src/services/StorageService/index.ts` - Updated exports
- `src/stores/libraryStore.ts` - Connected to database with persistence

---

## Day 5: Library UI Enhancements 📚 ✅

**Goal:** Enhance library screen with sorting, filtering, and view options.
**Status:** COMPLETED

### Tasks

- [x] Implement grid/list view toggle
- [x] Add sort options (title, author, recent, progress)
- [x] Add filter options (format, reading status, proficiency)
- [x] Implement book long-press menu (delete, edit, info)
- [x] Add book detail screen
- [x] Create list view item component

### Deliverables

- ✅ ViewToggle component for grid/list switching
- ✅ SortFilterBar with sort modal and filter bottom sheet
- ✅ BookContextMenu with delete confirmation
- ✅ BookListItem for list view display
- ✅ BookDetailScreen with progress, stats, and actions

### Files Created/Updated

- `src/components/library/ViewToggle.tsx` - Grid/List toggle with icons
- `src/components/library/SortFilterBar.tsx` - Sort and filter modals
- `src/components/library/BookContextMenu.tsx` - Long-press actions menu
- `src/components/library/BookListItem.tsx` - List view item
- `src/components/library/index.ts` - Updated exports
- `src/screens/BookDetail/BookDetailScreen.tsx` - Book details screen
- `src/screens/BookDetail/index.ts` - Screen exports

---

## Progress Tracking

| Day   | Status      | Date   | Notes                                                    |
| ----- | ----------- | ------ | -------------------------------------------------------- |
| Day 1 | ✅ Complete | Jan 20 | ImportService, document picker, progress modal           |
| Day 2 | ✅ Complete | Jan 20 | EPUB parsing, metadata extraction, TOC, cover extraction |
| Day 3 | ✅ Complete | Jan 20 | ImageService, caching, thumbnails, BookCover component   |
| Day 4 | ✅ Complete | Jan 20 | SQLite database, repositories, libraryStore persistence  |
| Day 5 | ✅ Complete | Jan 21 | ViewToggle, SortFilterBar, BookContextMenu, BookDetail   |

---

## Technical Notes

### Supported Formats (Week 2)
- **EPUB** - Primary format, full support
- **TXT** - Basic support (no metadata)

### File Storage Strategy
```
/Documents/
  /books/
    /{bookId}/
      - book.epub          # Original file
      - cover.jpg          # Extracted cover
      - cover_thumb.jpg    # Thumbnail
      - metadata.json      # Cached metadata
```

### Database Schema (Books)
```sql
CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cover_path TEXT,
  file_path TEXT NOT NULL,
  format TEXT NOT NULL,
  file_size INTEGER,
  added_at INTEGER NOT NULL,
  last_read_at INTEGER,
  progress REAL DEFAULT 0,
  current_location TEXT,
  current_chapter INTEGER DEFAULT 0,
  total_chapters INTEGER DEFAULT 0,
  current_page INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 0,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  word_density REAL DEFAULT 0.3,
  is_downloaded INTEGER DEFAULT 1
);
```
