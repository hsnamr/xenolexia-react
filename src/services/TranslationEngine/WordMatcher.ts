/**
 * Word Matcher - Matches source words to target language translations
 */

import type {Language, ProficiencyLevel, WordEntry, PartOfSpeech} from '@types/index';

export class WordMatcher {
  private sourceLanguage: Language;
  private targetLanguage: Language;
  private wordList: Map<string, WordEntry> = new Map();
  private variantsMap: Map<string, string> = new Map(); // variant -> canonical form
  private isLoaded: boolean = false;

  constructor(sourceLanguage: Language, targetLanguage: Language) {
    this.sourceLanguage = sourceLanguage;
    this.targetLanguage = targetLanguage;
  }

  /**
   * Load word list for the language pair
   */
  async loadWordList(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // TODO: Load from SQLite database or bundled assets
      // For now, use placeholder data for English -> Greek
      
      if (this.sourceLanguage === 'en' && this.targetLanguage === 'el') {
        this.initializeEnglishGreekWordList();
      }

      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load word list:', error);
      throw error;
    }
  }

  /**
   * Find a matching translation for a word
   */
  async findMatch(word: string, maxLevel: ProficiencyLevel): Promise<WordEntry | null> {
    if (!this.isLoaded) {
      await this.loadWordList();
    }

    const normalized = word.toLowerCase();

    // Check direct match
    let entry = this.wordList.get(normalized);

    // Check variants (plurals, conjugations)
    if (!entry) {
      const canonical = this.variantsMap.get(normalized);
      if (canonical) {
        entry = this.wordList.get(canonical);
      }
    }

    // Check if word is within proficiency level
    if (entry && this.isWithinLevel(entry.proficiencyLevel, maxLevel)) {
      return entry;
    }

    return null;
  }

  /**
   * Get all words at a specific proficiency level
   */
  getWordsByLevel(level: ProficiencyLevel): WordEntry[] {
    const words: WordEntry[] = [];
    this.wordList.forEach(entry => {
      if (entry.proficiencyLevel === level) {
        words.push(entry);
      }
    });
    return words;
  }

  // Private methods

  private isWithinLevel(wordLevel: ProficiencyLevel, maxLevel: ProficiencyLevel): boolean {
    const levels: ProficiencyLevel[] = ['beginner', 'intermediate', 'advanced'];
    return levels.indexOf(wordLevel) <= levels.indexOf(maxLevel);
  }

  private initializeEnglishGreekWordList(): void {
    // Beginner words (A1-A2) - Most common ~500 words
    const beginnerWords: Array<{
      source: string;
      target: string;
      pos: PartOfSpeech;
      variants?: string[];
    }> = [
      // Common nouns
      {source: 'house', target: 'σπίτι', pos: 'noun', variants: ['houses']},
      {source: 'water', target: 'νερό', pos: 'noun'},
      {source: 'book', target: 'βιβλίο', pos: 'noun', variants: ['books']},
      {source: 'dog', target: 'σκύλος', pos: 'noun', variants: ['dogs']},
      {source: 'cat', target: 'γάτα', pos: 'noun', variants: ['cats']},
      {source: 'food', target: 'φαγητό', pos: 'noun'},
      {source: 'friend', target: 'φίλος', pos: 'noun', variants: ['friends']},
      {source: 'family', target: 'οικογένεια', pos: 'noun', variants: ['families']},
      {source: 'child', target: 'παιδί', pos: 'noun', variants: ['children']},
      {source: 'mother', target: 'μητέρα', pos: 'noun', variants: ['mothers']},
      {source: 'father', target: 'πατέρας', pos: 'noun', variants: ['fathers']},
      {source: 'day', target: 'ημέρα', pos: 'noun', variants: ['days']},
      {source: 'night', target: 'νύχτα', pos: 'noun', variants: ['nights']},
      {source: 'time', target: 'χρόνος', pos: 'noun'},
      {source: 'year', target: 'χρόνος', pos: 'noun', variants: ['years']},
      {source: 'man', target: 'άνδρας', pos: 'noun', variants: ['men']},
      {source: 'woman', target: 'γυναίκα', pos: 'noun', variants: ['women']},
      {source: 'name', target: 'όνομα', pos: 'noun', variants: ['names']},
      {source: 'world', target: 'κόσμος', pos: 'noun'},
      {source: 'city', target: 'πόλη', pos: 'noun', variants: ['cities']},
      
      // Common verbs
      {source: 'go', target: 'πηγαίνω', pos: 'verb', variants: ['goes', 'going', 'went', 'gone']},
      {source: 'come', target: 'έρχομαι', pos: 'verb', variants: ['comes', 'coming', 'came']},
      {source: 'see', target: 'βλέπω', pos: 'verb', variants: ['sees', 'seeing', 'saw', 'seen']},
      {source: 'know', target: 'ξέρω', pos: 'verb', variants: ['knows', 'knowing', 'knew', 'known']},
      {source: 'want', target: 'θέλω', pos: 'verb', variants: ['wants', 'wanting', 'wanted']},
      {source: 'love', target: 'αγαπώ', pos: 'verb', variants: ['loves', 'loving', 'loved']},
      {source: 'eat', target: 'τρώω', pos: 'verb', variants: ['eats', 'eating', 'ate', 'eaten']},
      {source: 'drink', target: 'πίνω', pos: 'verb', variants: ['drinks', 'drinking', 'drank', 'drunk']},
      {source: 'sleep', target: 'κοιμάμαι', pos: 'verb', variants: ['sleeps', 'sleeping', 'slept']},
      {source: 'walk', target: 'περπατώ', pos: 'verb', variants: ['walks', 'walking', 'walked']},
      
      // Common adjectives
      {source: 'good', target: 'καλός', pos: 'adjective'},
      {source: 'bad', target: 'κακός', pos: 'adjective'},
      {source: 'big', target: 'μεγάλος', pos: 'adjective'},
      {source: 'small', target: 'μικρός', pos: 'adjective'},
      {source: 'new', target: 'νέος', pos: 'adjective'},
      {source: 'old', target: 'παλιός', pos: 'adjective'},
      {source: 'beautiful', target: 'όμορφος', pos: 'adjective'},
      {source: 'happy', target: 'χαρούμενος', pos: 'adjective'},
      {source: 'sad', target: 'λυπημένος', pos: 'adjective'},
      {source: 'hot', target: 'ζεστός', pos: 'adjective'},
      {source: 'cold', target: 'κρύος', pos: 'adjective'},
    ];

    // Intermediate words (B1-B2) - Words 501-2000
    const intermediateWords: Array<{
      source: string;
      target: string;
      pos: PartOfSpeech;
      variants?: string[];
    }> = [
      {source: 'government', target: 'κυβέρνηση', pos: 'noun'},
      {source: 'problem', target: 'πρόβλημα', pos: 'noun', variants: ['problems']},
      {source: 'decision', target: 'απόφαση', pos: 'noun', variants: ['decisions']},
      {source: 'experience', target: 'εμπειρία', pos: 'noun', variants: ['experiences']},
      {source: 'opportunity', target: 'ευκαιρία', pos: 'noun', variants: ['opportunities']},
      {source: 'relationship', target: 'σχέση', pos: 'noun', variants: ['relationships']},
      {source: 'situation', target: 'κατάσταση', pos: 'noun', variants: ['situations']},
      {source: 'believe', target: 'πιστεύω', pos: 'verb', variants: ['believes', 'believed', 'believing']},
      {source: 'remember', target: 'θυμάμαι', pos: 'verb', variants: ['remembers', 'remembered']},
      {source: 'understand', target: 'καταλαβαίνω', pos: 'verb', variants: ['understands', 'understood']},
      {source: 'important', target: 'σημαντικός', pos: 'adjective'},
      {source: 'different', target: 'διαφορετικός', pos: 'adjective'},
      {source: 'possible', target: 'πιθανός', pos: 'adjective'},
      {source: 'necessary', target: 'απαραίτητος', pos: 'adjective'},
    ];

    // Advanced words (C1-C2) - Words 2001+
    const advancedWords: Array<{
      source: string;
      target: string;
      pos: PartOfSpeech;
      variants?: string[];
    }> = [
      {source: 'phenomenon', target: 'φαινόμενο', pos: 'noun', variants: ['phenomena']},
      {source: 'hypothesis', target: 'υπόθεση', pos: 'noun', variants: ['hypotheses']},
      {source: 'consequence', target: 'συνέπεια', pos: 'noun', variants: ['consequences']},
      {source: 'comprehend', target: 'κατανοώ', pos: 'verb', variants: ['comprehends', 'comprehended']},
      {source: 'elaborate', target: 'επεξεργάζομαι', pos: 'verb', variants: ['elaborates', 'elaborated']},
      {source: 'sophisticated', target: 'εκλεπτυσμένος', pos: 'adjective'},
      {source: 'inevitable', target: 'αναπόφευκτος', pos: 'adjective'},
      {source: 'ambiguous', target: 'διφορούμενος', pos: 'adjective'},
    ];

    // Add all words to the map
    let id = 1;
    const addWords = (
      words: typeof beginnerWords,
      level: ProficiencyLevel,
      startRank: number,
    ) => {
      words.forEach((word, index) => {
        const entry: WordEntry = {
          id: (id++).toString(),
          sourceWord: word.source,
          targetWord: word.target,
          sourceLanguage: 'en',
          targetLanguage: 'el',
          proficiencyLevel: level,
          frequencyRank: startRank + index,
          partOfSpeech: word.pos,
          variants: word.variants || [],
        };

        this.wordList.set(word.source, entry);

        // Add variants mapping
        word.variants?.forEach(variant => {
          this.variantsMap.set(variant.toLowerCase(), word.source);
        });
      });
    };

    addWords(beginnerWords, 'beginner', 1);
    addWords(intermediateWords, 'intermediate', 501);
    addWords(advancedWords, 'advanced', 2001);
  }
}
