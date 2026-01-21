# Week 3: Reader Screen & Translation Engine - Daily Breakdown

## Overview

Week 3 focuses on implementing the core reading experience - the Reader screen with EPUB content rendering and the Translation Engine that powers the foreign word replacement feature.

---

## Day 1: EPUB Content Rendering 📖 ✅

**Goal:** Render EPUB chapter content in the Reader screen using WebView.
**Status:** COMPLETED

### Tasks

- [x] Create ChapterContentService for extracting chapter HTML
- [x] Set up WebView-based EPUB renderer
- [x] Implement chapter loading and display
- [x] Handle embedded images and styles
- [x] Create chapter navigation (prev/next)
- [x] Implement progress tracking based on scroll position
- [x] Save/restore reading position

### Deliverables

- ✅ Reader screen displays actual EPUB content via WebView
- ✅ Users can navigate between chapters (prev/next buttons + chapter list)
- ✅ Progress is tracked as user scrolls (reported via WebView postMessage)
- ✅ Reading position saved when leaving

### Files Created/Updated

- `src/services/BookParser/ChapterContentService.ts` - Extract chapter HTML with styles
- `src/screens/Reader/ReaderScreen.tsx` - Complete rewrite with WebView renderer
- `src/screens/Reader/components/EPUBRenderer.tsx` - WebView wrapper component
- `src/screens/Reader/components/index.ts` - Component exports
- `src/stores/readerStore.ts` - Full rewrite with EPUBParser integration
- `src/services/BookParser/index.ts` - Added ChapterContentService exports

---

## Day 2: Reader Settings & Customization ⚙️ ✅

**Goal:** Implement reader appearance settings (font, size, theme).
**Status:** COMPLETED

### Tasks

- [x] Create reader settings panel/modal
- [x] Implement font family selection (Serif, Sans-serif, Dyslexic)
- [x] Add font size adjustment (slider or buttons)
- [x] Implement line spacing control
- [x] Add margin/padding adjustment
- [x] Inject custom CSS into WebView based on settings
- [x] Persist reader settings per book

### Deliverables

- ✅ Two-tab settings modal (Appearance & Reading)
- ✅ 5 font options including OpenDyslexic
- ✅ Interactive slider with +/- buttons
- ✅ Real-time preview with foreign word sample
- ✅ Settings persistence via AsyncStorage (global + per-book)
- ✅ Complete CSS stylesheet generation

### Files Created/Updated

- `src/components/settings/SettingsSlider.tsx` - Interactive slider with gesture handling
- `src/services/ReaderStyleService.ts` - CSS generation, theme/font definitions, persistence
- `src/components/reader/ReaderSettingsModal.tsx` - Complete redesign with tabs
- `src/services/index.ts` - Added ReaderStyleService exports

---

## Day 3: Translation Engine - Word Database 🗄️ ✅

**Goal:** Set up word database with frequency-ranked translations.
**Status:** COMPLETED

### Tasks

- [x] Create word_list table schema with frequency ranks
- [x] Import sample frequency data (English → Greek as test)
- [x] Map words to proficiency levels:
  - Beginner (A1-A2): Top 500 most common
  - Intermediate (B1-B2): Words 501-2000
  - Advanced (C1-C2): Words 2001-5000+
- [x] Create WordDatabaseService for lookups
- [x] Implement word matching with variants (plurals, etc.)
- [x] Handle case sensitivity

### Deliverables

- ✅ WordDatabaseService with SQLite integration and in-memory cache
- ✅ Bulk import functionality with transaction support
- ✅ Word lookup with variant matching (plurals, conjugations)
- ✅ 235+ English-Greek words across all proficiency levels
- ✅ Updated WordMatcher using database with fallback

### Files Created/Updated

- `src/services/TranslationEngine/WordDatabase.ts` - Full database service
- `src/services/TranslationEngine/WordMatcher.ts` - Updated to use database
- `src/services/TranslationEngine/index.ts` - Added new exports
- `src/data/words_en_el.ts` - Comprehensive word list with pronunciations
- `src/data/index.ts` - Data exports

---

## Day 3.5: Multi-Language Translation Support 🌍 ✅

**Goal:** Enable any-to-any language translation using free APIs
**Status:** COMPLETED

### Tasks

- [x] Create TranslationAPIService with multiple providers
- [x] Support LibreTranslate, MyMemory, Lingva APIs
- [x] Create FrequencyListService for word difficulty ranking
- [x] Create DynamicWordDatabase for any language pair
- [x] Add 28 supported languages with metadata
- [x] Implement caching and offline support

### Deliverables

- ✅ TranslationAPIService with 3 provider backends
- ✅ Automatic fallback between providers
- ✅ Rate limiting and response caching
- ✅ FrequencyListService using open source word lists
- ✅ DynamicWordDatabase combining API + frequency data
- ✅ 28 languages with names, flags, RTL support

### Files Created

- `src/services/TranslationEngine/TranslationAPIService.ts` - Multi-provider API
- `src/services/TranslationEngine/FrequencyListService.ts` - Word frequency lists
- `src/services/TranslationEngine/DynamicWordDatabase.ts` - Language-agnostic DB
- `src/types/index.ts` - Extended with 28 languages + metadata

---

## Day 4: Translation Engine - Word Replacement ⭐ ✅

**Goal:** Implement the core word replacement algorithm.
**Status:** COMPLETED

### Tasks

- [x] Create text tokenizer that preserves HTML structure
- [x] Implement word identification in text
- [x] Apply replacement based on:
  - User's proficiency level
  - Word density setting
  - Context (avoid names, quotes, technical terms)
- [x] Mark replaced words with special attributes for tap detection
- [x] Create ProcessedContent type with replacement metadata
- [x] Handle punctuation attached to words

### Deliverables

- ✅ `Tokenizer` class with HTML-aware tokenization
- ✅ Context detection (quotes, names, code blocks)
- ✅ `WordReplacer` with multiple selection strategies
- ✅ Minimum word spacing constraint
- ✅ Case preservation in replacements
- ✅ Foreign word markers with data attributes
- ✅ Integration with DynamicWordDatabase

### Files Created/Updated

- `src/services/TranslationEngine/Tokenizer.ts` - HTML-aware tokenization
- `src/services/TranslationEngine/WordReplacer.ts` - Word replacement logic
- `src/services/TranslationEngine/TranslationEngine.ts` - Updated main service
- `src/services/TranslationEngine/index.ts` - New exports

---

## Day 5: Foreign Word Interaction 👆

**Goal:** Enable tap interaction on foreign words in the reader.

### Tasks

- [ ] Inject JavaScript into WebView for tap detection
- [ ] Bridge WebView messages to React Native
- [ ] Create TranslationPopup component for word info
- [ ] Display: foreign word, original, pronunciation
- [ ] Add "Save to vocabulary" button
- [ ] Add "I knew this" button
- [ ] Implement long-press for more options
- [ ] Style foreign words distinctly (underline, color)

### Deliverables

- Tapping foreign word shows popup with translation
- Users can save words to vocabulary
- Users can mark words as known
- Foreign words are visually distinct in text

### Files to Create/Update

- `src/screens/Reader/hooks/useWordTapHandler.ts` - Tap detection hook
- `src/components/reader/TranslationPopup.tsx` - Update with real functionality
- `src/services/TranslationEngine/InjectedScript.ts` - WebView JS
- `src/screens/Reader/ReaderScreen.tsx` - Integrate popup
- `src/stores/vocabularyStore.ts` - Add word from reader

---

## Progress Tracking

| Day     | Status      | Date   | Notes                                                    |
| ------- | ----------- | ------ | -------------------------------------------------------- |
| Day 1   | ✅ Complete | Jan 21 | ChapterContentService, EPUBRenderer, readerStore         |
| Day 2   | ✅ Complete | Jan 21 | Interactive slider, ReaderStyleService, settings modal   |
| Day 3   | ✅ Complete | Jan 21 | WordDatabase, 235+ EN-EL words, variant matching         |
| Day 3.5 | ✅ Complete | Jan 21 | Multi-language: TranslationAPI, FrequencyList, 28 langs  |
| Day 4   | ✅ Complete | Jan 21 | Tokenizer, WordReplacer, context-aware replacement       |
| Day 5   | ⏳ Pending  |        |                                                          |

---

## Technical Notes

### WebView Communication

```typescript
// React Native → WebView (inject settings)
webViewRef.current?.injectJavaScript(`
  window.applyReaderSettings(${JSON.stringify(settings)});
`);

// WebView → React Native (word tap)
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'wordTap',
  word: 'σπίτι',
  original: 'house',
  position: { x: 120, y: 340 }
}));
```

### Word Replacement Process

```
1. Load chapter HTML content
2. Parse HTML to extract text nodes
3. Tokenize text into words
4. For each word:
   a. Look up in word database
   b. Check if proficiency matches
   c. Apply density filter
   d. Check context rules
5. Wrap replaceable words with <span class="foreign" data-original="...">
6. Reconstruct HTML
7. Render in WebView
```

### Reader CSS Injection

```css
/* Foreign word styling */
.foreign-word {
  color: var(--foreign-color);
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: pointer;
}

/* Reader settings */
:root {
  --font-family: 'Merriweather', serif;
  --font-size: 18px;
  --line-height: 1.8;
  --margin: 24px;
}
```

---

## Dependencies

### From Previous Weeks
- ✅ EPUB extraction (JSZip, EPUBExtractor)
- ✅ Metadata parsing (MetadataExtractor)
- ✅ SQLite database (DatabaseService)
- ✅ ReaderStore (basic structure)
- ✅ VocabularyStore (for saving words)

### New This Week
- `react-native-webview` - Already installed
- Word frequency data (will create sample)
