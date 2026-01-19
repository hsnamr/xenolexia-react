# Xenolexia 📚🌍

> *Learn languages through the stories you love*

**Xenolexia** is a React Native e-book reader that revolutionizes language learning by seamlessly blending foreign vocabulary into books you read in your native language. Instead of drilling vocabulary in isolation, you encounter new words in rich, familiar contexts—making acquisition natural and memorable.

---

## 🎯 The Concept

Imagine reading your favorite novel in English while learning Greek. As you read, words matching your proficiency level appear in Greek instead of English. You understand them from context, and if you need help, a simple tap reveals the original word.

**Example at Beginner Level:**
> "She walked into the σπίτι and set down her keys."

*Tap "σπίτι" → reveals "house"*

This contextual immersion mimics how we naturally acquire language—through meaningful exposure rather than rote memorization.

---

## ✨ Features

### Core Reading Experience
- 📖 **Multi-format Support**: EPUB, FB2, MOBI (DRM-free), and plain text
- 🎨 **Customizable Reader**: Fonts, themes (light/dark/sepia), margins, line spacing
- 📑 **Reading Progress**: Automatic bookmarking and progress sync
- 🔍 **Search**: Full-text search within books

### Language Learning Engine
- 🌐 **Multiple Language Pairs**: English ↔ Greek, Spanish, French, German, Italian, Portuguese, and more
- 📊 **Proficiency Levels**: Beginner, Intermediate, Advanced (A1-C2 CEFR mapping)
- 🎚️ **Adjustable Density**: Control how many words appear in the target language (10%-90%)
- 🧠 **Smart Word Selection**: AI-powered selection based on:
  - Word frequency rankings
  - Context clarity
  - Part of speech
  - User's learning history

### Vocabulary Building
- 💡 **Tap-to-Reveal**: Instant translation popup on tap
- ⭐ **Word Saving**: Save words to personal vocabulary lists
- 📈 **Spaced Repetition**: Built-in SRS for saved vocabulary
- 📊 **Progress Analytics**: Track words learned, reading time, improvement over time

### Library Management
- 📂 **Import Books**: From device storage, cloud services, or URLs
- 📚 **Collections**: Organize books by language pair, genre, or custom categories
- ☁️ **Cloud Sync**: Sync library and progress across devices (optional)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         XENOLEXIA APP                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Library    │  │   Reader     │  │   Vocabulary         │  │
│  │   Screen     │  │   Screen     │  │   Screen             │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│  ┌──────┴─────────────────┴──────────────────────┴───────────┐  │
│  │                    Navigation Layer                       │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────┴────────────────────────────────┐  │
│  │                    State Management                        │  │
│  │              (Zustand + React Query)                       │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                   │
│  ┌─────────────┬────────────┴───────────┬──────────────────┐   │
│  │  Book       │  Translation           │  Vocabulary       │   │
│  │  Parser     │  Engine                │  Manager          │   │
│  │  Service    │  Service               │  Service          │   │
│  └─────────────┴────────────────────────┴──────────────────┘   │
│                             │                                   │
│  ┌──────────────────────────┴────────────────────────────────┐  │
│  │              Local Storage (SQLite + AsyncStorage)         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native 0.73+ with New Architecture |
| **Language** | TypeScript 5.x |
| **Navigation** | React Navigation 6.x |
| **State** | Zustand + React Query |
| **Storage** | SQLite (react-native-sqlite-storage) + AsyncStorage |
| **Book Parsing** | epub.js, Custom FB2/MOBI parsers |
| **Styling** | NativeWind (TailwindCSS for RN) |
| **Testing** | Jest + React Native Testing Library |
| **CI/CD** | GitHub Actions + Fastlane |

---

## 📱 Supported Platforms

- **iOS**: 13.0+
- **Android**: API 24+ (Android 7.0+)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- React Native CLI
- Xcode 15+ (for iOS)
- Android Studio with SDK 34+ (for Android)
- CocoaPods (iOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/xenolexia.git
cd xenolexia

# Install dependencies
npm install

# iOS specific
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Optional: Cloud sync API
API_BASE_URL=https://api.xenolexia.app
API_KEY=your_api_key

# Optional: Analytics
ANALYTICS_ENABLED=false
```

---

## 📁 Project Structure

```
xenolexia/
├── src/
│   ├── app/                    # App entry and configuration
│   ├── components/             # Reusable UI components
│   │   ├── common/            # Buttons, inputs, modals
│   │   ├── reader/            # Reader-specific components
│   │   └── vocabulary/        # Vocabulary-specific components
│   ├── screens/               # Screen components
│   │   ├── Library/
│   │   ├── Reader/
│   │   ├── Vocabulary/
│   │   ├── Settings/
│   │   └── Onboarding/
│   ├── services/              # Business logic
│   │   ├── BookParser/        # EPUB, FB2, MOBI parsing
│   │   ├── TranslationEngine/ # Word replacement logic
│   │   ├── VocabularyManager/ # SRS and word tracking
│   │   └── StorageService/    # Database operations
│   ├── stores/                # Zustand stores
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Helper functions
│   ├── types/                 # TypeScript definitions
│   ├── constants/             # App constants
│   ├── assets/                # Fonts, images, word lists
│   │   └── wordlists/         # Frequency-ranked word lists
│   └── navigation/            # Navigation configuration
├── ios/                       # iOS native code
├── android/                   # Android native code
├── __tests__/                 # Test files
├── docs/                      # Documentation
└── scripts/                   # Build and utility scripts
```

---

## 🗺️ Roadmap

### Phase 1: MVP (v0.1) - Core Reading ✅
- [ ] EPUB file parsing and rendering
- [ ] Basic reader with customization
- [ ] Single language pair (English → Greek)
- [ ] Beginner vocabulary replacement
- [ ] Tap-to-reveal functionality

### Phase 2: Learning Engine (v0.2)
- [ ] All proficiency levels
- [ ] Multiple language pairs
- [ ] Vocabulary density control
- [ ] Word saving and lists

### Phase 3: Smart Features (v0.3)
- [ ] Spaced repetition system
- [ ] Learning analytics
- [ ] Smart word selection algorithm
- [ ] Reading statistics

### Phase 4: Polish & Scale (v1.0)
- [ ] Cloud sync
- [ ] Additional book formats
- [ ] Social features (share progress)
- [ ] Premium features

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Word frequency lists from [Lexiteria](https://github.com/lexiteria)
- EPUB parsing inspired by [epub.js](https://github.com/futurepress/epub.js)
- Language learning methodology informed by comprehensible input theory

---

<p align="center">
  <strong>Xenolexia</strong> — Where stories become your teacher 📖✨
</p>
