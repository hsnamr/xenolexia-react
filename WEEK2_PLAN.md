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

## Day 2: EPUB Metadata Parsing 📖

**Goal:** Extract book metadata from EPUB files.

### Tasks

- [ ] Implement EPUB package.opf parsing
- [ ] Extract title, author, description
- [ ] Extract language and publisher info
- [ ] Parse table of contents (toc.ncx/nav.xhtml)
- [ ] Handle different EPUB versions (2.0, 3.0)
- [ ] Create metadata extraction utilities

### Deliverables

- EPUB files are parsed for metadata
- Title, author, description extracted
- Table of contents structure parsed
- Support for EPUB 2.0 and 3.0

### Files to Create/Update

- `src/services/BookParser/EPUBParser.ts` - Enhanced parsing
- `src/services/BookParser/MetadataExtractor.ts` - Metadata extraction
- `src/services/BookParser/TOCParser.ts` - Table of contents parsing
- `src/services/BookParser/types.ts` - Parser types

---

## Day 3: Cover Image Extraction & Storage 🖼️

**Goal:** Extract and store book cover images.

### Tasks

- [ ] Extract cover image from EPUB
- [ ] Handle different cover image formats (jpg, png, svg)
- [ ] Store cover images in app storage
- [ ] Generate thumbnails for grid view
- [ ] Implement placeholder for books without covers
- [ ] Create image caching strategy

### Deliverables

- Cover images extracted from EPUBs
- Images stored locally with proper naming
- Thumbnails generated for performance
- Fallback UI for missing covers

### Files to Create/Update

- `src/services/BookParser/CoverExtractor.ts` - Cover extraction
- `src/services/ImageService/ImageService.ts` - Image operations
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

| Day   | Status      | Date   | Notes                                          |
| ----- | ----------- | ------ | ---------------------------------------------- |
| Day 1 | ✅ Complete | Jan 20 | ImportService, document picker, progress modal |
| Day 2 | ⏳ Pending  |        |                                                |
| Day 3 | ⏳ Pending  |        |                                                |
| Day 4 | ⏳ Pending  |        |                                                |
| Day 5 | ⏳ Pending  |        |                                                |

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
