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

## Day 2: Reader Settings & Customization ⚙️

**Goal:** Implement reader appearance settings (font, size, theme).

### Tasks

- [ ] Create reader settings panel/modal
- [ ] Implement font family selection (Serif, Sans-serif, Dyslexic)
- [ ] Add font size adjustment (slider or buttons)
- [ ] Implement line spacing control
- [ ] Add margin/padding adjustment
- [ ] Inject custom CSS into WebView based on settings
- [ ] Persist reader settings per book

### Deliverables

- Users can customize reader appearance
- Settings are injected into EPUB content via CSS
- Settings persist between sessions
- Real-time preview of changes

### Files to Create/Update

- `src/components/reader/ReaderSettingsModal.tsx` - Update with real controls
- `src/services/ReaderStyleService.ts` - Generate CSS from settings
- `src/stores/readerStore.ts` - Add settings state
- `src/screens/Reader/ReaderScreen.tsx` - Integrate settings

---

## Day 3: Translation Engine - Word Database 🗄️

**Goal:** Set up word database with frequency-ranked translations.

### Tasks

- [ ] Create word_list table schema with frequency ranks
- [ ] Import sample frequency data (English → Greek as test)
- [ ] Map words to proficiency levels:
  - Beginner (A1-A2): Top 500 most common
  - Intermediate (B1-B2): Words 501-2000
  - Advanced (C1-C2): Words 2001-5000+
- [ ] Create WordDatabaseService for lookups
- [ ] Implement word matching with variants (plurals, etc.)
- [ ] Handle case sensitivity

### Deliverables

- SQLite table with frequency-ranked word translations
- Service to query words by proficiency level
- Word matching that handles basic variants
- Sample dataset for English → Greek

### Files to Create/Update

- `src/services/TranslationEngine/WordDatabase.ts` - Word lookup service
- `src/services/StorageService/DatabaseSchema.ts` - Add word_list table
- `src/data/words_en_el.json` - Sample word data (English-Greek)
- `src/services/TranslationEngine/types.ts` - Update with database types

---

## Day 4: Translation Engine - Word Replacement ⭐

**Goal:** Implement the core word replacement algorithm.

### Tasks

- [ ] Create text tokenizer that preserves HTML structure
- [ ] Implement word identification in text
- [ ] Apply replacement based on:
  - User's proficiency level
  - Word density setting
  - Context (avoid names, quotes, technical terms)
- [ ] Mark replaced words with special attributes for tap detection
- [ ] Create ProcessedContent type with replacement metadata
- [ ] Handle punctuation attached to words

### Deliverables

- TranslationEngine.processContent() method works
- Text is tokenized while preserving HTML
- Words are replaced according to settings
- Replaced words are marked for interaction

### Files to Create/Update

- `src/services/TranslationEngine/Tokenizer.ts` - Text tokenization
- `src/services/TranslationEngine/WordReplacer.ts` - Replacement logic
- `src/services/TranslationEngine/TranslationEngine.ts` - Main service
- `src/services/TranslationEngine/types.ts` - ProcessedContent types

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

| Day   | Status      | Date   | Notes                                                  |
| ----- | ----------- | ------ | ------------------------------------------------------ |
| Day 1 | ✅ Complete | Jan 21 | ChapterContentService, EPUBRenderer, readerStore       |
| Day 2 | ⏳ Pending  |        |                                                        |
| Day 3 | ⏳ Pending  |        |                                                        |
| Day 4 | ⏳ Pending  |        |                                                        |
| Day 5 | ⏳ Pending  |        |                                                        |

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
