/**
 * Statistics Screen - Displays reading and learning progress
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useStatisticsStore} from '@stores/statisticsStore';
import {StatCard} from '@components/statistics/StatCard';

export function StatisticsScreen(): React.JSX.Element {
  const {stats} = useStatisticsStore();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Track your learning journey</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
          <Text style={styles.streakBest}>Best: {stats.longestStreak} days</Text>
        </View>

        {/* Today's Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="📖"
              value={stats.wordsRevealedToday.toString()}
              label="Words Seen"
              color="#0ea5e9"
            />
            <StatCard
              icon="💾"
              value={stats.wordsSavedToday.toString()}
              label="Words Saved"
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* All-time Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Time</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="📚"
              value={stats.totalBooksRead.toString()}
              label="Books Read"
              color="#10b981"
            />
            <StatCard
              icon="⏱️"
              value={formatTime(stats.totalReadingTime)}
              label="Reading Time"
              color="#f59e0b"
            />
            <StatCard
              icon="🧠"
              value={stats.totalWordsLearned.toString()}
              label="Words Learned"
              color="#ef4444"
            />
            <StatCard
              icon="📊"
              value={formatTime(stats.averageSessionDuration)}
              label="Avg. Session"
              color="#6366f1"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  streakCard: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#92400e',
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
    marginTop: 4,
  },
  streakBest: {
    fontSize: 14,
    color: '#b45309',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
