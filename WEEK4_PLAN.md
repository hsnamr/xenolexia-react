# Week 4: Vocabulary Screen & Review Mode - Daily Breakdown

## Overview

Week 4 focuses on completing the Vocabulary Manager (Phase 5) - building the UI for viewing, managing, and reviewing saved vocabulary words. The backend (database, SM-2 algorithm) is already complete from Week 3.

---

## Day 1: Vocabulary Screen - List View 📝

**Goal:** Create the main Vocabulary screen with a searchable, filterable list of saved words.

### Tasks

- [ ] Create `VocabularyScreen.tsx` with full functionality
- [ ] Implement word list with `FlatList` (virtualized)
- [ ] Create `VocabularyWordCard` component showing:
  - Source word → Target word
  - Part of speech
  - Book it came from
  - Status badge (new/learning/review/learned)
  - Date added
- [ ] Add search bar with debounced search
- [ ] Add filter chips (by status, by book, by language)
- [ ] Add sort options (alphabetical, date added, due for review)
- [ ] Empty state when no vocabulary

### Deliverables

- Functional Vocabulary screen displaying all saved words
- Search and filter working
- Tap on word shows details

### Files to Create/Update

- `src/screens/Vocabulary/VocabularyScreen.tsx` - Complete rewrite
- `src/components/vocabulary/VocabularyWordCard.tsx` - New component
- `src/components/vocabulary/VocabularyFilters.tsx` - Filter UI
- `src/components/vocabulary/index.ts` - Exports

---

## Day 2: Word Detail & Edit Modal 🔍

**Goal:** Create a detail view for vocabulary words with edit/delete capabilities.

### Tasks

- [ ] Create `WordDetailModal` component showing:
  - Full word information
  - Pronunciation (if available)
  - Context sentence from book
  - SRS statistics (ease factor, interval, next review)
  - Review history
- [ ] Implement edit functionality:
  - Edit source/target word
  - Update context sentence
  - Change status manually
- [ ] Implement delete with confirmation
- [ ] Add "Practice this word" quick action
- [ ] Show book link (navigate to reader at word location)

### Deliverables

- Tap on word opens detail modal
- Can edit word information
- Can delete word
- SRS stats visible

### Files to Create/Update

- `src/components/vocabulary/WordDetailModal.tsx` - New component
- `src/components/vocabulary/WordEditForm.tsx` - Edit form
- `src/stores/vocabularyStore.ts` - Add edit action if needed

---

## Day 3: Review Mode - Core UI 🎴

**Goal:** Build the flashcard-style review interface for spaced repetition practice.

### Tasks

- [ ] Create `ReviewScreen.tsx` for SRS review sessions
- [ ] Create `FlashCard` component with flip animation:
  - Front: Foreign word (target language)
  - Back: Original word + pronunciation + context
- [ ] Implement card flip gesture (tap or swipe up)
- [ ] Create review progress bar (X of Y cards)
- [ ] Add session summary at end
- [ ] Handle empty state (no cards due)

### Deliverables

- Review screen accessible from Vocabulary tab
- Cards flip to reveal answer
- Progress tracked during session

### Files to Create/Update

- `src/screens/Vocabulary/ReviewScreen.tsx` - New screen
- `src/components/vocabulary/FlashCard.tsx` - Animated flashcard
- `src/components/vocabulary/ReviewProgress.tsx` - Progress indicator
- `src/navigation/AppNavigator.tsx` - Add Review screen route

---

## Day 4: Review Mode - Grading & SRS Integration 📊

**Goal:** Implement self-grading and connect to SM-2 spaced repetition system.

### Tasks

- [ ] Create grading buttons (Again, Hard, Good, Easy)
- [ ] Connect grades to `vocabularyStore.recordReview()`
- [ ] Animate card exit after grading
- [ ] Load next card automatically
- [ ] Show next review date after grading
- [ ] Calculate and display session statistics:
  - Cards reviewed
  - Accuracy rate
  - Time spent
  - Words mastered
- [ ] Create `ReviewSessionSummary` component

### Deliverables

- Grading affects SRS scheduling
- Session ends with summary
- Stats saved to database

### Files to Create/Update

- `src/components/vocabulary/GradingButtons.tsx` - Self-grade UI
- `src/components/vocabulary/ReviewSessionSummary.tsx` - End screen
- `src/stores/vocabularyStore.ts` - Session tracking
- `src/services/StorageService/repositories/SessionRepository.ts` - Review sessions

---

## Day 5: Vocabulary Export & Statistics 📤

**Goal:** Add export functionality and vocabulary statistics view.

### Tasks

- [ ] Implement CSV export of vocabulary
- [ ] Implement Anki-compatible export (TSV with tags)
- [ ] Create `VocabularyStats` component showing:
  - Total words saved
  - Words by status (pie chart)
  - Words by language pair
  - Learning streak
  - Average accuracy
  - Projected mastery date
- [ ] Add "Start Review" button with due count badge
- [ ] Add quick stats to Vocabulary screen header

### Deliverables

- Export vocabulary to CSV/Anki format
- Statistics visible on Vocabulary screen
- Clear call-to-action for review

### Files to Create/Update

- `src/services/ExportService/ExportService.ts` - New service
- `src/services/ExportService/index.ts` - Exports
- `src/components/vocabulary/VocabularyStats.tsx` - Stats display
- `src/components/statistics/VocabularyChart.tsx` - Visual charts

---

## Progress Tracking

| Day   | Status      | Date   | Notes                                                |
| ----- | ----------- | ------ | ---------------------------------------------------- |
| Day 1 | ✅ Complete | Jan 21 | VocabularyScreen exists, added WordDetailModal       |
| Day 2 | ✅ Complete | Jan 21 | WordDetailModal with edit/delete                     |
| Day 3 | ✅ Complete | Jan 21 | FlashCard, ReviewScreen, ReviewProgress              |
| Day 4 | ✅ Complete | Jan 21 | GradingButtons, ReviewSessionSummary, SRS integration|
| Day 5 | ⏳ Pending  |        |                                                      |

---

## Technical Notes

### FlashCard Animation

```typescript
// Using react-native-reanimated for smooth flip
const rotateY = useSharedValue(0);

const flipCard = () => {
  rotateY.value = withSpring(rotateY.value === 0 ? 180 : 0);
};

const frontStyle = useAnimatedStyle(() => ({
  transform: [{ rotateY: `${rotateY.value}deg` }],
  backfaceVisibility: 'hidden',
}));

const backStyle = useAnimatedStyle(() => ({
  transform: [{ rotateY: `${rotateY.value + 180}deg` }],
  backfaceVisibility: 'hidden',
}));
```

### SM-2 Grading Scale

| Grade | Name  | Description                    | Effect on Interval |
| ----- | ----- | ------------------------------ | ------------------ |
| 0     | Again | Complete blackout              | Reset to 1 day     |
| 1     | Hard  | Incorrect, but remembered hint | Reduce by 50%      |
| 2     | Good  | Correct with effort            | Multiply by EF     |
| 3     | Easy  | Correct immediately            | Multiply by EF×1.3 |

### Export Formats

**CSV Format:**
```csv
source_word,target_word,source_lang,target_lang,context,status,added_at
hello,hola,en,es,"She said hello to everyone",learning,2024-01-21
```

**Anki Format (TSV):**
```
hello	hola	She said hello to everyone	en-es::beginner
```

---

## Dependencies

All required dependencies are already installed:
- `react-native-reanimated` - For flip animations
- `react-native-gesture-handler` - For swipe gestures
- `react-native-share` - For export sharing
- `date-fns` - For date formatting

---

## Design Considerations

### Vocabulary Screen Layout
```
┌─────────────────────────────────┐
│ Vocabulary           [Search 🔍]│
├─────────────────────────────────┤
│ [All] [New] [Learning] [Due: 5] │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ σπίτι → house              │ │
│ │ noun • The Great Gatsby    │ │
│ │ ○○○●● Learning             │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ γάτα → cat                 │ │
│ │ noun • Pride & Prejudice   │ │
│ │ ●●●●● Learned              │ │
│ └─────────────────────────────┘ │
│          ...                    │
├─────────────────────────────────┤
│    [📊 Stats]  [🎴 Review (5)]  │
└─────────────────────────────────┘
```

### Review Screen Layout
```
┌─────────────────────────────────┐
│ ← Review          3 of 15  ━━━○ │
├─────────────────────────────────┤
│                                 │
│         ┌───────────────┐       │
│         │               │       │
│         │    σπίτι     │       │
│         │               │       │
│         │  [tap to flip]│       │
│         └───────────────┘       │
│                                 │
│  From: The Great Gatsby         │
│                                 │
├─────────────────────────────────┤
│ [Again] [Hard] [Good] [Easy]    │
└─────────────────────────────────┘
```
