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

## Day 3: Image Service & Thumbnails 🖼️

**Goal:** Create image service for thumbnails and caching.

> Note: Basic cover extraction was completed in Day 2 as part of MetadataExtractor.

### Tasks

- [ ] Create ImageService for image operations
- [ ] Generate thumbnails for grid view performance
- [ ] Implement image caching with memory/disk layers
- [ ] Create BookCover component with loading states
- [ ] Implement placeholder for books without covers
- [ ] Add cover image preview in import flow

### Deliverables

- ImageService with resize/thumbnail capabilities
- Cached cover images with fast loading
- Thumbnails generated for grid view
- BookCover component with fallback UI

### Files to Create/Update

- `src/services/ImageService/ImageService.ts` - Image operations
- `src/services/ImageService/ThumbnailGenerator.ts` - Thumbnail creation
- `src/services/ImageService/ImageCache.ts` - Caching logic
- `src/services/ImageService/index.ts` - Exports
- `src/components/library/BookCover.tsx` - Cover display component

---

## Day 4: SQLite Database Implementation 💾

**Goal:** Persist book data in SQLite database.

### Tasks

- [ ] Implement SQLite connection and initialization
- [ ] Create books table schema
- [ ] Implement CRUD operations for books
- [ ] Add reading progress table
- [ ] Implement database migrations
- [ ] Connect libraryStore to database

### Deliverables

- SQLite database initialized on app start
- Books persisted across app restarts
- Reading progress saved to database
- Database migrations for schema updates

### Files to Create/Update

- `src/services/StorageService/DatabaseService.ts` - SQLite operations
- `src/services/StorageService/migrations/` - Migration files
- `src/services/StorageService/repositories/BookRepository.ts` - Book queries
- `src/stores/libraryStore.ts` - Connect to database

---

## Day 5: Library UI Enhancements 📚

**Goal:** Enhance library screen with sorting, filtering, and view options.

### Tasks

- [ ] Implement grid/list view toggle
- [ ] Add sort options (title, author, recent, progress)
- [ ] Add filter options (format, reading status)
- [ ] Implement book long-press menu (delete, edit, info)
- [ ] Add book detail modal/screen
- [ ] Implement pull-to-refresh with database sync

### Deliverables

- Toggle between grid and list views
- Sort books by various criteria
- Filter books by status
- Context menu for book actions
- Book detail view

### Files to Create/Update

- `src/components/library/ViewToggle.tsx` - Grid/List toggle
- `src/components/library/SortFilterBar.tsx` - Sort and filter UI
- `src/components/library/BookContextMenu.tsx` - Long-press menu
- `src/screens/Library/LibraryScreen.tsx` - Enhanced UI
- `src/screens/BookDetail/BookDetailScreen.tsx` - Book details

---

## Progress Tracking

| Day   | Status      | Date   | Notes                                                    |
| ----- | ----------- | ------ | -------------------------------------------------------- |
| Day 1 | ✅ Complete | Jan 20 | ImportService, document picker, progress modal           |
| Day 2 | ✅ Complete | Jan 20 | EPUB parsing, metadata extraction, TOC, cover extraction |
| Day 3 | ⏳ Pending  |        |                                                          |
| Day 4 | ⏳ Pending  |        |                                                          |
| Day 5 | ⏳ Pending  |        |                                                          |

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
