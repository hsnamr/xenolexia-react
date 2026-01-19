/**
 * Translation Engine - Processes text and replaces words with target language
 */

import type {ForeignWordData, WordEntry} from '@types/index';
import type {TranslationOptions, ProcessedText, ProcessingStats} from './types';
import {WordMatcher} from './WordMatcher';

export class TranslationEngine {
  private wordMatcher: WordMatcher;
  private options: TranslationOptions;

  constructor(options: TranslationOptions) {
    this.options = options;
    this.wordMatcher = new WordMatcher(options.sourceLanguage, options.targetLanguage);
  }

  /**
   * Process text content and replace eligible words
   */
  async processContent(content: string): Promise<ProcessedText> {
    const startTime = Date.now();
    const foreignWords: ForeignWordData[] = [];

    // Parse HTML and extract text nodes
    const textSegments = this.extractTextSegments(content);

    let totalWords = 0;
    let eligibleWords = 0;
    let replacedWords = 0;

    // Process each text segment
    let processedContent = content;
    let offset = 0;

    for (const segment of textSegments) {
      const words = this.tokenize(segment.text);
      totalWords += words.length;

      // Find eligible words for this segment
      const matches = await this.findMatches(words);
      eligibleWords += matches.filter(m => m.entry !== null).length;

      // Select words to replace based on density
      const toReplace = this.selectWordsToReplace(matches);
      replacedWords += toReplace.length;

      // Replace words in content
      for (const match of toReplace.reverse()) {
        const originalText = segment.text.substring(match.startIndex, match.endIndex);
        const foreignWord = match.entry!.targetWord;

        // Preserve original case
        const casePreservedWord = this.preserveCase(originalText, foreignWord);

        // Create foreign word marker
        const marker = this.createForeignWordMarker(
          casePreservedWord,
          match.entry!,
          match.startIndex + segment.position + offset,
        );

        // Store foreign word data
        foreignWords.push({
          originalWord: match.originalWord,
          foreignWord: casePreservedWord,
          startIndex: match.startIndex + segment.position + offset,
          endIndex: match.endIndex + segment.position + offset,
          wordEntry: match.entry!,
        });

        // Replace in content
        const before = processedContent.substring(0, segment.position + match.startIndex + offset);
        const after = processedContent.substring(segment.position + match.endIndex + offset);
        processedContent = before + marker + after;

        // Update offset for next replacement
        offset += marker.length - originalText.length;
      }
    }

    const stats: ProcessingStats = {
      totalWords,
      eligibleWords,
      replacedWords,
      processingTime: Date.now() - startTime,
    };

    return {
      content: processedContent,
      foreignWords,
      stats,
    };
  }

  /**
   * Update translation options
   */
  updateOptions(options: Partial<TranslationOptions>): void {
    this.options = {...this.options, ...options};
    if (options.sourceLanguage || options.targetLanguage) {
      this.wordMatcher = new WordMatcher(
        options.sourceLanguage || this.options.sourceLanguage,
        options.targetLanguage || this.options.targetLanguage,
      );
    }
  }

  // Private methods

  private extractTextSegments(html: string): Array<{text: string; position: number}> {
    // Simple extraction - in production, use proper HTML parser
    const segments: Array<{text: string; position: number}> = [];
    const tagRegex = /<[^>]*>/g;
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: html.substring(lastIndex, match.index),
          position: lastIndex,
        });
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < html.length) {
      segments.push({
        text: html.substring(lastIndex),
        position: lastIndex,
      });
    }

    return segments;
  }

  private tokenize(text: string): Array<{word: string; start: number; end: number}> {
    const tokens: Array<{word: string; start: number; end: number}> = [];
    const wordRegex = /\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      tokens.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return tokens;
  }

  private async findMatches(
    words: Array<{word: string; start: number; end: number}>,
  ): Promise<Array<{
    originalWord: string;
    normalizedWord: string;
    startIndex: number;
    endIndex: number;
    entry: WordEntry | null;
  }>> {
    return Promise.all(
      words.map(async ({word, start, end}) => {
        const entry = await this.wordMatcher.findMatch(
          word,
          this.options.proficiencyLevel,
        );
        return {
          originalWord: word,
          normalizedWord: word.toLowerCase(),
          startIndex: start,
          endIndex: end,
          entry,
        };
      }),
    );
  }

  private selectWordsToReplace(
    matches: Array<{
      originalWord: string;
      entry: WordEntry | null;
      startIndex: number;
      endIndex: number;
    }>,
  ): Array<{
    originalWord: string;
    entry: WordEntry;
    startIndex: number;
    endIndex: number;
  }> {
    // Filter to eligible words only
    const eligible = matches.filter(
      m =>
        m.entry !== null &&
        !this.options.excludeWords?.includes(m.originalWord.toLowerCase()),
    ) as Array<{
      originalWord: string;
      entry: WordEntry;
      startIndex: number;
      endIndex: number;
    }>;

    // Calculate how many to replace based on density
    const targetCount = Math.floor(eligible.length * this.options.density);

    // Shuffle and select
    const shuffled = this.shuffle([...eligible]);
    return shuffled.slice(0, targetCount);
  }

  private preserveCase(original: string, replacement: string): string {
    if (original === original.toUpperCase()) {
      return replacement.toUpperCase();
    }
    if (original[0] === original[0].toUpperCase()) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  private createForeignWordMarker(word: string, entry: WordEntry, position: number): string {
    // Create a span with data attributes for tap handling
    return `<span class="foreign-word" data-original="${entry.sourceWord}" data-position="${position}">${word}</span>`;
  }

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
