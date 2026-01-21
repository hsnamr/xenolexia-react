# Xenolexia Development Plan 📋

## Overview

This document outlines the complete development roadmap for Xenolexia, from initial setup to production release.

---

## 📅 Development Phases

### Phase 0: Project Setup (Week 1)
**Status: ✅ COMPLETED**

#### 0.1 Environment Configuration
- [x] Create project structure
- [x] Initialize React Native with TypeScript
- [x] Set up Git repository
- [x] Configure ESLint + Prettier
- [x] Set up Husky pre-commit hooks
- [x] Configure path aliases (@components, @services, etc.)

#### 0.2 Core Dependencies Installation
- [x] All core dependencies installed (see package.json)
- [x] Navigation: @react-navigation/native, bottom-tabs, native-stack
- [x] State Management: zustand, @tanstack/react-query
- [x] Storage: @react-native-async-storage/async-storage, react-native-sqlite-storage
- [x] File System: react-native-fs, react-native-document-picker
- [x] UI/Styling: nativewind, tailwindcss, react-native-reanimated
- [x] Book Parsing: epubjs, jszip, react-native-webview
- [x] Utils: lodash, date-fns, uuid, react-native-svg

#### 0.3 Initial App Structure
- [x] Create navigation skeleton with Stack + Bottom Tabs
- [x] Implement basic screens (Library, Reader, Vocabulary, Statistics, Settings, Profile)
- [x] Set up theme provider with Light/Dark/Sepia modes
- [x] Configure fonts and base styles (Inter, Merriweather, JetBrains Mono)
- [x] Create reusable UI components (Text, Button, Card, Input, ThemeSwitcher)
- [x] Set up deep linking configuration
- [x] Implement SVG-based tab bar icons

#### 0.4 Quality & Testing (Completed)
- [x] Jest test configuration with path aliases
- [x] Test utilities for rendering with providers
- [x] Navigation smoke tests
- [x] Screen component tests (Library, Vocabulary)
- [x] UI component tests (Text, Button, Card, Input)
- [x] Store tests (vocabularyStore, utils)

---

### Phase 1: Library Screen (Weeks 2-3)
**Status: ✅ COMPLETED**

#### 1.1 Book Import
- [x] Implement document picker for file selection
- [x] Support multiple file formats (EPUB, TXT, MOBI, FB2)
- [x] Parse EPUB metadata (title, author, cover, TOC)
- [x] Store book files in app storage
- [x] Create database schema for books
- [x] Import progress modal with status indicator

**Technical Details:**
```typescript
// Book entity structure (Implemented)
interface Book {
  id: string;
  title: string;
  author: string;
  coverPath: string | null;
  filePath: string;
  format: 'epub' | 'fb2' | 'mobi' | 'txt';
  addedAt: Date;
  lastReadAt: Date | null;
  progress: number; // 0-100
  currentLocation: string | null; // CFI for EPUB
  languagePair: LanguagePair;
  settings: BookSettings;
}
```

#### 1.2 Library UI
- [x] Grid/List view toggle (ViewToggle component)
- [x] Book cards with cover, title, progress (BookCard, BookCover)
- [x] Search and filter functionality (SortFilterBar)
- [x] Sort options (recent, title, author, progress)
- [x] Delete/edit book functionality (BookContextMenu)
- [x] Book detail screen (BookDetailScreen)
- [x] List view item (BookListItem)

#### 1.3 Collections (Stretch)
- [ ] Create custom collections
- [ ] Drag books into collections
- [x] Smart collections (currently reading, completed) - via store selectors

---

### Phase 2: EPUB Parser Service (Weeks 3-4)
**Status: 🔶 MOSTLY COMPLETED**

#### 2.1 Core Parsing
- [x] Extract EPUB structure (spine, manifest, toc) - EPUBExtractor
- [x] Parse table of contents (NCX for EPUB 2, NAV for EPUB 3) - TOCParser
- [x] Extract metadata (title, author, description, cover) - MetadataExtractor
- [ ] Parse chapter content to HTML/text
- [ ] Handle embedded images and styles
- [ ] Extract all text nodes for word replacement

**Architecture:**
```typescript
// BookParser interface (Implemented)
interface IBookParser {
  parse(filePath: string): Promise<ParsedBook>;
  getChapter(index: number): Promise<Chapter>;
  getTableOfContents(): TOCItem[];
  search(query: string): SearchResult[];
}

// EPUB-specific implementation (Partially Implemented)
class EPUBParser implements IBookParser {
  // Uses JSZip for extraction
  // EPUBExtractor for ZIP/XML parsing
  // TOCParser for NCX/NAV parsing
  // MetadataExtractor for metadata
}
```

#### 2.2 Text Processing Pipeline
- [ ] Tokenize text into words
- [ ] Preserve HTML structure around words
- [ ] Handle punctuation correctly
- [ ] Support hyphenated words
- [ ] Maintain word positions for tap detection

---

### Phase 3: Translation Engine (Weeks 4-6) ⭐ CORE FEATURE
**Status: 🔶 IN PROGRESS**

#### 3.1 Word Database Setup
- [x] Import frequency-ranked word lists per language (FrequencyListService)
- [x] Map words to proficiency levels:
  - **Beginner (A1-A2)**: Top 500 most common words
  - **Intermediate (B1-B2)**: Words ranked 501-2000
  - **Advanced (C1-C2)**: Words ranked 2001-5000+
- [x] Create translation pairs database (DynamicWordDatabase)
- [x] Multi-provider translation API (LibreTranslate, MyMemory, Lingva)
- [x] Support 28+ languages with metadata

**Implementation:**
```typescript
// TranslationAPIService - Multiple free translation providers
const result = await translationAPI.translate('house', 'en', 'es');
// { translatedText: 'casa', provider: 'libretranslate', ... }

// FrequencyListService - Word frequency from open corpora
const rank = await frequencyListService.getWordRank('en', 'house');
// Returns rank (1-5000+) used for proficiency level

// DynamicWordDatabase - Combines API + frequency for any language pair
const entry = await dynamicWordDatabase.lookupWord('hello', 'en', 'fr');
// { sourceWord: 'hello', targetWord: 'bonjour', proficiencyLevel: 'beginner', ... }
```

#### 3.2 Word Replacement Algorithm
- [x] Identify replaceable words in text (TranslationEngine.tokenize)
- [x] Match words accounting for:
  - Case sensitivity
  - Plural forms (variants support)
  - Verb conjugations (basic)
- [x] Respect density setting (% of words to replace)
- [ ] Avoid replacing within quotes, names, technical terms
- [ ] Ensure grammatical markers remain (articles stay English)

**Algorithm (Implemented in TranslationEngine.ts):**
```typescript
// Process content and replace words based on settings
const processed = await translationEngine.processContent(chapterHtml);
// Returns: { content: htmlWithForeignWords, foreignWords: [...], stats: {...} }
```

#### 3.3 Context-Aware Selection
- [x] Random selection based on density setting
- [ ] Prefer replacing nouns and verbs (high meaning density)
- [ ] Avoid replacing words in ambiguous contexts
- [ ] Consider sentence structure
- [ ] Track replaced words to avoid repetition
- [ ] Adapt based on user's saved vocabulary

---

### Phase 4: Reader Screen (Weeks 6-8)
**Status: 🔶 IN PROGRESS**

#### 4.1 Basic Reader
- [x] Render processed book content (WebView-based EPUBRenderer)
- [x] Implement continuous scroll with progress tracking
- [x] Chapter navigation (prev/next + chapter list)
- [x] Progress tracking (scroll position + chapter)
- [x] Save reading position automatically

#### 4.2 Reader Customization
- [x] Font selection (Serif, Sans-serif, Dyslexic-friendly - 5 options)
- [x] Font size adjustment (12-32pt slider)
- [x] Line spacing control (1.0-2.5x slider)
- [x] Margin adjustment (8-56px slider)
- [x] Theme selection (Light, Dark, Sepia)
- [ ] Brightness control

#### 4.3 Foreign Word Interaction ⭐
- [x] Style foreign words distinctly (underline, color via CSS)
- [x] Tap detection on foreign words (WebView postMessage)
- [x] Translation popup component:
  - Original word ✅
  - Phonetic pronunciation ✅
  - Save to vocabulary button ✅
  - "I knew this" button ✅
- [x] Long-press for more options (implemented in WebView)

**Implemented Components:**
- `EPUBRenderer.tsx` - WebView-based content renderer
- `ChapterContentService.ts` - CSS injection and JS for tap handling
- `ReaderSettingsModal.tsx` - Two-tab settings (Appearance/Reading)
- `TranslationPopup.tsx` - Word reveal modal

#### 4.4 Reading Statistics
- [x] Track time spent reading (via ReadingSession)
- [x] Count chapters read
- [x] Track words revealed vs. saved (statisticsStore)
- [ ] Session summary on close

---

### Phase 5: Vocabulary Manager (Weeks 8-10)

#### 5.1 Word Storage
- [ ] Save words from reader to vocabulary
- [ ] Store context sentence with each word
- [ ] Track when word was first seen
- [ ] Track reveal count per word
- [ ] Mark words as "learned"

#### 5.2 Vocabulary Screen
- [ ] List all saved words
- [ ] Filter by book, date, status
- [ ] Search vocabulary
- [ ] Edit/delete words
- [ ] Export vocabulary (CSV, Anki)

#### 5.3 Spaced Repetition System (SRS)
- [ ] Implement SM-2 algorithm or similar
- [ ] Schedule word reviews
- [ ] Review mode:
  - Show foreign word
  - User attempts recall
  - Reveal and self-grade
- [ ] Track review statistics

---

### Phase 6: Settings & Onboarding (Weeks 10-11)

#### 6.1 Onboarding Flow
1. Welcome screen with app explanation
2. Select native language
3. Select target language
4. Select proficiency level (with examples)
5. Adjust initial density preference
6. Import first book or use sample

#### 6.2 Settings Screen
- [ ] Language pair configuration
- [ ] Proficiency level adjustment
- [ ] Word density slider
- [ ] Reader appearance defaults
- [ ] Notification preferences
- [ ] Data export/backup
- [ ] About & help section

---

### Phase 7: Polish & Testing (Weeks 11-13)

#### 7.1 Testing
- [ ] Unit tests for services
- [ ] Integration tests for book parsing
- [ ] E2E tests for critical flows
- [ ] Performance testing with large books
- [ ] Memory leak detection

#### 7.2 Optimization
- [ ] Lazy load chapters
- [ ] Virtualize long content
- [ ] Optimize database queries
- [ ] Reduce bundle size
- [ ] Implement caching strategies

#### 7.3 Accessibility
- [ ] Screen reader support
- [ ] Dynamic text sizing
- [ ] High contrast mode
- [ ] Keyboard navigation (tablets)

#### 7.4 Localization
- [ ] Extract all UI strings
- [ ] Support RTL languages (future)
- [ ] Localize for major markets

---

### Phase 8: Release Preparation (Weeks 13-14)

#### 8.1 App Store Assets
- [ ] App icons (all sizes)
- [ ] Screenshots for all devices
- [ ] App preview video
- [ ] App Store description
- [ ] Privacy policy
- [ ] Terms of service

#### 8.2 CI/CD Pipeline
- [ ] GitHub Actions for builds
- [ ] Automated testing on PR
- [ ] Fastlane for deployments
- [ ] TestFlight / Internal testing setup
- [ ] Production deployment workflow

#### 8.3 Launch
- [ ] Beta testing with real users
- [ ] Gather feedback and iterate
- [ ] App Store submission
- [ ] Play Store submission
- [ ] Launch marketing

---

## 🔧 Technical Decisions

### Why React Native?
- Cross-platform (iOS + Android) from single codebase
- Large ecosystem and community
- Excellent performance with New Architecture
- Familiar to web developers

### Why Zustand over Redux?
- Simpler API, less boilerplate
- Better TypeScript support
- Smaller bundle size
- Sufficient for app's state needs

### Why SQLite over Realm?
- Standard SQL queries
- Better tooling and debugging
- Familiar to most developers
- Excellent performance for our use case

### EPUB Rendering Strategy
- Use WebView with epub.js for complex EPUB rendering
- Inject custom CSS for foreign word styling
- Use postMessage bridge for tap detection
- Fall back to native Text components for simple content

---

## 📊 Data Models

### Database Schema (SQLite)

```sql
-- Books table
CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cover_path TEXT,
  file_path TEXT NOT NULL,
  format TEXT NOT NULL,
  added_at INTEGER NOT NULL,
  last_read_at INTEGER,
  progress REAL DEFAULT 0,
  current_location TEXT,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  density REAL DEFAULT 0.3
);

-- Vocabulary table
CREATE TABLE vocabulary (
  id TEXT PRIMARY KEY,
  source_word TEXT NOT NULL,
  target_word TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  context_sentence TEXT,
  book_id TEXT,
  added_at INTEGER NOT NULL,
  last_reviewed_at INTEGER,
  review_count INTEGER DEFAULT 0,
  ease_factor REAL DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Reading sessions table
CREATE TABLE reading_sessions (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  pages_read INTEGER DEFAULT 0,
  words_revealed INTEGER DEFAULT 0,
  words_saved INTEGER DEFAULT 0,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Word list table (populated from assets)
CREATE TABLE word_list (
  id TEXT PRIMARY KEY,
  source_word TEXT NOT NULL,
  target_word TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  frequency_rank INTEGER,
  part_of_speech TEXT,
  variants TEXT -- JSON array
);
```

---

## 🚧 Known Challenges & Solutions

### Challenge 1: EPUB Complexity
**Problem:** EPUBs vary wildly in structure and formatting.
**Solution:** Use battle-tested epub.js, implement fallbacks, test with diverse EPUBs.

### Challenge 2: Word Boundary Detection
**Problem:** Different languages have different tokenization rules.
**Solution:** Start with English source only, use language-specific tokenizers.

### Challenge 3: Grammatical Correctness
**Problem:** Direct word replacement can create awkward grammar.
**Solution:** Start with nouns (least grammar-dependent), expand carefully.

### Challenge 4: Performance with Large Books
**Problem:** Processing entire books at once is slow.
**Solution:** Process chapters on-demand, cache processed content.

### Challenge 5: Offline Functionality
**Problem:** Users expect to read without internet.
**Solution:** All core features work offline, sync when available.

---

## 📈 Success Metrics

### MVP Success (Phase 1 Release)
- [ ] Can import and read an EPUB
- [ ] Foreign words appear at correct proficiency level
- [ ] Tap-to-reveal works smoothly
- [ ] Can save words to vocabulary
- [ ] App doesn't crash on common operations

### Growth Metrics (Post-Launch)
- Daily Active Users (DAU)
- Average reading time per session
- Words revealed / Words saved ratio
- Retention (Day 1, Day 7, Day 30)
- App Store ratings

---

## 🔗 Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [epub.js Documentation](http://epubjs.org/documentation/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/getting-started/introduction)

### Word Lists
- [SUBTLEX frequency lists](https://www.ugent.be/pp/experimentele-psychologie/en/research/documents/subtlexus)
- [OpenSubtitles frequency lists](https://github.com/hermitdave/FrequencyWords)

### Design Inspiration
- Apple Books
- Kindle
- Moon+ Reader
- Duolingo (for learning UX)

---

## 📝 Notes

- ~~Start with English → Greek as primary pair~~ → **Now supports 28+ language pairs**
- Uses free translation APIs (LibreTranslate, MyMemory, Lingva) for any-to-any translation
- FrequencyListService fetches open source word frequency lists for proficiency ranking
- Keep MVP scope tight—resist feature creep
- Prioritize reading experience over learning features initially
- Get real user feedback early and often

---

## 🌍 Supported Languages (28+)

| Language | Code | Flag | RTL |
|----------|------|------|-----|
| English | en | 🇬🇧 | - |
| Spanish | es | 🇪🇸 | - |
| French | fr | 🇫🇷 | - |
| German | de | 🇩🇪 | - |
| Italian | it | 🇮🇹 | - |
| Portuguese | pt | 🇵🇹 | - |
| Russian | ru | 🇷🇺 | - |
| Greek | el | 🇬🇷 | - |
| Dutch | nl | 🇳🇱 | - |
| Polish | pl | 🇵🇱 | - |
| Turkish | tr | 🇹🇷 | - |
| Japanese | ja | 🇯🇵 | - |
| Chinese | zh | 🇨🇳 | - |
| Korean | ko | 🇰🇷 | - |
| Arabic | ar | 🇵🇸 | ✅ |
| Hebrew | he | 🇮🇱 | ✅ |
| + 12 more... | | | |

---

*Last Updated: January 2026*
