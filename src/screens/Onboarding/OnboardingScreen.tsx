/**
 * Onboarding Screen - Initial setup flow for new users
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import type {Language, ProficiencyLevel} from '@types/index';
import {useUserStore} from '@stores/userStore';

const {width} = Dimensions.get('window');

type OnboardingStep = 'welcome' | 'native' | 'target' | 'level' | 'complete';

const LANGUAGES: {code: Language; name: string; flag: string}[] = [
  {code: 'en', name: 'English', flag: '🇬🇧'},
  {code: 'el', name: 'Greek', flag: '🇬🇷'},
  {code: 'es', name: 'Spanish', flag: '🇪🇸'},
  {code: 'fr', name: 'French', flag: '🇫🇷'},
  {code: 'de', name: 'German', flag: '🇩🇪'},
  {code: 'it', name: 'Italian', flag: '🇮🇹'},
  {code: 'pt', name: 'Portuguese', flag: '🇵🇹'},
];

const LEVELS: {level: ProficiencyLevel; title: string; description: string; cefr: string}[] = [
  {
    level: 'beginner',
    title: 'Beginner',
    description: 'Basic vocabulary: numbers, colors, common objects',
    cefr: 'A1-A2',
  },
  {
    level: 'intermediate',
    title: 'Intermediate',
    description: 'Everyday vocabulary: actions, descriptions, abstract concepts',
    cefr: 'B1-B2',
  },
  {
    level: 'advanced',
    title: 'Advanced',
    description: 'Complex vocabulary: idioms, technical terms, nuanced expressions',
    cefr: 'C1-C2',
  },
];

export function OnboardingScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {updatePreferences} = useUserStore();

  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [nativeLanguage, setNativeLanguage] = useState<Language>('en');
  const [targetLanguage, setTargetLanguage] = useState<Language>('el');
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>('beginner');

  const handleComplete = useCallback(() => {
    updatePreferences({
      defaultSourceLanguage: nativeLanguage,
      defaultTargetLanguage: targetLanguage,
      defaultProficiencyLevel: proficiencyLevel,
      hasCompletedOnboarding: true,
    });
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs'}],
    });
  }, [navigation, updatePreferences, nativeLanguage, targetLanguage, proficiencyLevel]);

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>📚🌍</Text>
      <Text style={styles.title}>Welcome to Xenolexia</Text>
      <Text style={styles.subtitle}>
        Learn languages naturally through the stories you love
      </Text>
      <Text style={styles.description}>
        As you read books in your native language, words will be gradually replaced 
        with your target language. Learn from context, not flashcards.
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('native')}>
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLanguageSelection = (
    title: string,
    selectedLanguage: Language,
    onSelect: (lang: Language) => void,
    onNext: () => void,
    excludeLanguage?: Language,
  ) => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{title}</Text>
      <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
        {LANGUAGES.filter(l => l.code !== excludeLanguage).map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.optionItem,
              selectedLanguage === lang.code && styles.optionItemSelected,
            ]}
            onPress={() => onSelect(lang.code)}>
            <Text style={styles.optionFlag}>{lang.flag}</Text>
            <Text
              style={[
                styles.optionText,
                selectedLanguage === lang.code && styles.optionTextSelected,
              ]}>
              {lang.name}
            </Text>
            {selectedLanguage === lang.code && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLevelSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your level in {LANGUAGES.find(l => l.code === targetLanguage)?.name}?</Text>
      <View style={styles.levelsList}>
        {LEVELS.map(({level, title, description, cefr}) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.levelItem,
              proficiencyLevel === level && styles.levelItemSelected,
            ]}
            onPress={() => setProficiencyLevel(level)}>
            <View style={styles.levelHeader}>
              <Text
                style={[
                  styles.levelTitle,
                  proficiencyLevel === level && styles.levelTitleSelected,
                ]}>
                {title}
              </Text>
              <Text style={styles.levelCefr}>{cefr}</Text>
            </View>
            <Text style={styles.levelDescription}>{description}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('complete')}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComplete = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>You're All Set!</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Learning Setup</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Reading in:</Text>
          <Text style={styles.summaryValue}>
            {LANGUAGES.find(l => l.code === nativeLanguage)?.flag}{' '}
            {LANGUAGES.find(l => l.code === nativeLanguage)?.name}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Learning:</Text>
          <Text style={styles.summaryValue}>
            {LANGUAGES.find(l => l.code === targetLanguage)?.flag}{' '}
            {LANGUAGES.find(l => l.code === targetLanguage)?.name}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Level:</Text>
          <Text style={styles.summaryValue}>
            {LEVELS.find(l => l.level === proficiencyLevel)?.title}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>
        Import your first book and start learning through reading!
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
        <Text style={styles.primaryButtonText}>Start Reading</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return renderWelcome();
      case 'native':
        return renderLanguageSelection(
          "What's your native language?",
          nativeLanguage,
          setNativeLanguage,
          () => setStep('target'),
        );
      case 'target':
        return renderLanguageSelection(
          'Which language do you want to learn?',
          targetLanguage,
          setTargetLanguage,
          () => setStep('level'),
          nativeLanguage,
        );
      case 'level':
        return renderLevelSelection();
      case 'complete':
        return renderComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {step !== 'welcome' && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            const steps: OnboardingStep[] = ['welcome', 'native', 'target', 'level', 'complete'];
            const currentIndex = steps.indexOf(step);
            if (currentIndex > 0) {
              setStep(steps[currentIndex - 1]);
            }
          }}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      )}
      {renderStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsList: {
    flex: 1,
    width: '100%',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  optionItemSelected: {
    backgroundColor: '#e0f2fe',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  optionFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#0369a1',
  },
  checkmark: {
    fontSize: 20,
    color: '#0ea5e9',
    fontWeight: '700',
  },
  levelsList: {
    flex: 1,
    width: '100%',
  },
  levelItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
  },
  levelItemSelected: {
    backgroundColor: '#e0f2fe',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  levelTitleSelected: {
    color: '#0369a1',
  },
  levelCefr: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
