/**
 * Reader Screen - Main book reading experience with foreign word integration
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';

import type {RootStackScreenProps} from '@types/navigation';
import type {ForeignWordData, Chapter} from '@types/index';
import {useLibraryStore} from '@stores/libraryStore';
import {useReaderStore} from '@stores/readerStore';
import {TranslationPopup} from '@components/reader/TranslationPopup';
import {ReaderSettingsModal} from '@components/reader/ReaderSettingsModal';
import {ChapterNavigator} from '@components/reader/ChapterNavigator';

type ReaderScreenProps = RootStackScreenProps<'Reader'>;

export function ReaderScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<ReaderScreenProps['route']>();
  const {bookId} = route.params;

  const {getBook} = useLibraryStore();
  const {
    currentChapter,
    processedContent,
    foreignWords,
    settings,
    loadBook,
    goToNextChapter,
    goToPreviousChapter,
  } = useReaderStore();

  const book = getBook(bookId);

  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [selectedWord, setSelectedWord] = useState<ForeignWordData | null>(null);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (book) {
      loadBook(book);
    }
  }, [book, loadBook]);

  const handleWordPress = useCallback((word: ForeignWordData) => {
    setSelectedWord(word);
  }, []);

  const handleDismissPopup = useCallback(() => {
    setSelectedWord(null);
  }, []);

  const handleToggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Book not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: settings.theme === 'dark' ? '#1a1a2e' : settings.theme === 'sepia' ? '#f4ecd8' : '#ffffff'}]} edges={['top']}>
      {/* Header Controls */}
      {showControls && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {book.title}
            </Text>
            <Text style={styles.chapterTitle} numberOfLines={1}>
              {currentChapter?.title || 'Loading...'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reader Content */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleToggleControls}
        style={styles.readerContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            {paddingHorizontal: settings.marginHorizontal},
          ]}
          showsVerticalScrollIndicator={false}>
          {/* Render processed content with foreign words */}
          <ReaderContent
            content={processedContent}
            foreignWords={foreignWords}
            settings={settings}
            onWordPress={handleWordPress}
          />
        </ScrollView>
      </TouchableOpacity>

      {/* Footer Controls */}
      {showControls && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={goToPreviousChapter} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹ Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowChapters(true)} style={styles.chapterButton}>
            <Text style={styles.progressText}>
              {book.progress.toFixed(0)}%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextChapter} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next ›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Translation Popup */}
      {selectedWord && (
        <TranslationPopup
          word={selectedWord}
          onDismiss={handleDismissPopup}
        />
      )}

      {/* Settings Modal */}
      <ReaderSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Chapter Navigator Modal */}
      <ChapterNavigator
        visible={showChapters}
        onClose={() => setShowChapters(false)}
        bookId={bookId}
      />
    </SafeAreaView>
  );
}

// Sub-component for rendering content with tappable foreign words
interface ReaderContentProps {
  content: string;
  foreignWords: ForeignWordData[];
  settings: any;
  onWordPress: (word: ForeignWordData) => void;
}

function ReaderContent({
  content,
  foreignWords,
  settings,
  onWordPress,
}: ReaderContentProps): React.JSX.Element {
  // TODO: Implement proper content parsing with foreign word highlighting
  // This is a placeholder that shows how the content would be rendered
  
  const textColor = settings.theme === 'dark' ? '#e5e7eb' : settings.theme === 'sepia' ? '#5c4b37' : '#1f2937';
  const foreignColor = settings.theme === 'dark' ? '#818cf8' : '#6366f1';

  return (
    <Text
      style={[
        styles.contentText,
        {
          fontSize: settings.fontSize,
          lineHeight: settings.fontSize * settings.lineHeight,
          color: textColor,
          fontFamily: settings.fontFamily,
        },
      ]}>
      {/* Placeholder content - will be replaced with actual parsed content */}
      Welcome to <Text style={[styles.foreignWord, {color: foreignColor}]} onPress={() => {}}>Xenolexia</Text>! 
      {'\n\n'}
      As you read, words in your target language will appear like <Text style={[styles.foreignWord, {color: foreignColor}]}>αυτό</Text> (this). 
      Tap on them to reveal the original word.
      {'\n\n'}
      Your current settings:
      {'\n'}• Language: {settings.targetLanguage || 'Greek'}
      {'\n'}• Level: {settings.proficiencyLevel || 'Beginner'}
      {'\n'}• Density: {Math.round((settings.wordDensity || 0.3) * 100)}%
      {'\n\n'}
      Import an EPUB book to start your language learning journey!
    </Text>
  );
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  chapterTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  readerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 24,
  },
  contentText: {
    textAlign: 'left',
  },
  foreignWord: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  chapterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 100,
  },
});
