# Week 5: Settings & Onboarding - Daily Breakdown

## Overview

Week 5 focuses on Phase 6 - Settings & Onboarding. This includes creating a welcoming first-run experience and comprehensive settings for customizing the app.

---

## Day 1: Onboarding - Welcome & Language Selection 👋

**Goal:** Create the initial onboarding screens for welcoming users and selecting languages.

### Tasks

- [ ] Create `OnboardingScreen.tsx` with multi-step flow
- [ ] Implement welcome screen with app introduction
- [ ] Create `LanguageSelector` component for source/target language
- [ ] Add animated transitions between steps
- [ ] Design progress indicator (dots or bar)
- [ ] Store selected languages in userStore

### Deliverables

- Welcome screen with app logo and description
- Source language selection (native language)
- Target language selection (learning language)
- Smooth step transitions

### Files to Create/Update

- `src/screens/Onboarding/OnboardingScreen.tsx` - Complete rewrite
- `src/components/onboarding/WelcomeStep.tsx` - Welcome content
- `src/components/onboarding/LanguageStep.tsx` - Language picker
- `src/components/onboarding/StepIndicator.tsx` - Progress dots
- `src/components/onboarding/index.ts` - Exports

---

## Day 2: Onboarding - Proficiency & Preferences 📊

**Goal:** Add proficiency level selection and initial preferences.

### Tasks

- [ ] Create `ProficiencyStep` with level selection
- [ ] Show example words for each level
- [ ] Create `DensityStep` with visual slider
- [ ] Preview density effect with sample text
- [ ] Add "Get Started" final step
- [ ] Save all preferences to userStore

### Deliverables

- Proficiency selection (Beginner/Intermediate/Advanced)
- Word density preference slider
- Ready-to-start confirmation
- All preferences persisted

### Files to Create/Update

- `src/components/onboarding/ProficiencyStep.tsx` - Level selection
- `src/components/onboarding/DensityStep.tsx` - Density slider
- `src/components/onboarding/CompletionStep.tsx` - Final step
- `src/stores/userStore.ts` - Add persistence

---

## Day 3: Settings Screen - Core Settings ⚙️

**Goal:** Build the main settings screen with key configuration options.

### Tasks

- [ ] Redesign `SettingsScreen.tsx` with sections
- [ ] Implement language pair settings
- [ ] Add proficiency level adjustment
- [ ] Create word density settings with preview
- [ ] Add reader default settings section
- [ ] Link to detailed settings screens

### Deliverables

- Settings screen with organized sections
- Language and proficiency editable
- Reader defaults configurable
- Navigation to sub-screens

### Files to Create/Update

- `src/screens/Settings/SettingsScreen.tsx` - Complete redesign
- `src/screens/Settings/LanguageSettingsScreen.tsx` - Language config
- `src/screens/Settings/ReaderDefaultsScreen.tsx` - Reader defaults

---

## Day 4: Settings - Data & Notifications 📱

**Goal:** Add data management and notification settings.

### Tasks

- [ ] Create data management section:
  - Export all data
  - Import data backup
  - Clear vocabulary
  - Clear reading history
  - Reset all settings
- [ ] Add notification settings:
  - Daily review reminders
  - Reading goal reminders
  - Time picker for reminders
- [ ] Implement confirmation dialogs for destructive actions

### Deliverables

- Data export/import working
- Clear data with confirmations
- Notification preferences saved

### Files to Create/Update

- `src/screens/Settings/DataManagementScreen.tsx` - Data options
- `src/screens/Settings/NotificationSettingsScreen.tsx` - Notifications
- `src/services/BackupService/BackupService.ts` - Data backup

---

## Day 5: Settings - About & Final Polish ✨

**Goal:** Add about section and polish all settings flows.

### Tasks

- [ ] Create About screen with:
  - App version and build info
  - Credits and acknowledgments
  - Open source licenses
  - Links to privacy policy, terms
  - Contact/support link
- [ ] Add "Rate App" and "Share App" options
- [ ] Implement dark mode system preference
- [ ] Polish all settings screens
- [ ] Test complete onboarding flow

### Deliverables

- Complete About screen
- All settings polished
- Onboarding to settings flow tested

### Files to Create/Update

- `src/screens/Settings/AboutScreen.tsx` - About info
- `src/components/settings/SettingsSection.tsx` - Reusable section
- `src/components/settings/SettingsRow.tsx` - Reusable row item

---

## Progress Tracking

| Day   | Status      | Date   | Notes                                             |
| ----- | ----------- | ------ | ------------------------------------------------- |
| Day 1 | ✅ Complete | Jan 21 | Enhanced OnboardingScreen with all 28 languages   |
| Day 2 | ✅ Complete | Jan 21 | Added density step with presets                   |
| Day 3 | ✅ Complete | Jan 21 | Complete SettingsScreen redesign                  |
| Day 4 | ✅ Complete | Jan 21 | DataManagement, Notifications screens             |
| Day 5 | ✅ Complete | Jan 21 | AboutScreen, LanguageSettings, navigation updates |

---

## Technical Notes

### Onboarding Flow State

```typescript
interface OnboardingState {
  currentStep: number;
  sourceLanguage: Language | null;
  targetLanguage: Language | null;
  proficiencyLevel: ProficiencyLevel | null;
  wordDensity: number;
  hasCompletedOnboarding: boolean;
}
```

### Settings Organization

```
Settings
├── Learning
│   ├── Languages (Source → Target)
│   ├── Proficiency Level
│   └── Word Density
├── Reader
│   ├── Default Theme
│   ├── Default Font
│   ├── Default Font Size
│   └── Auto-save Position
├── Notifications
│   ├── Daily Review Reminder
│   ├── Reading Goal Reminder
│   └── Reminder Time
├── Data
│   ├── Export Data
│   ├── Import Backup
│   ├── Clear Vocabulary
│   └── Reset Settings
└── About
    ├── Version Info
    ├── Licenses
    ├── Privacy Policy
    └── Contact Support
```

### Design Considerations

**Onboarding:**
- Large, friendly illustrations
- Minimal text, clear CTAs
- Skip option available
- Progress visible at all times

**Settings:**
- Grouped by category
- Toggles for binary options
- Pickers for selections
- Sliders for ranges
- Destructive actions in red
