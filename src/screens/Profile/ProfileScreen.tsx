/**
 * Profile Screen - User settings and preferences
 */

import React from 'react';

import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useUserStore} from '@stores/userStore';
import {SafeAreaView} from 'react-native-safe-area-context';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@types/index';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

function MenuItem({icon, title, subtitle, onPress}: MenuItemProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<ProfileNavigationProp>();
  const {preferences} = useUserStore();

  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
      en: 'English',
      el: 'Greek',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
    };
    return names[code] || code;
  };

  const getProficiencyLabel = (level: string): string => {
    const labels: Record<string, string> = {
      beginner: 'Beginner (A1-A2)',
      intermediate: 'Intermediate (B1-B2)',
      advanced: 'Advanced (C1-C2)',
    };
    return labels[level] || level;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Learning</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="🌐"
              title="Target Language"
              subtitle={getLanguageName(preferences.defaultTargetLanguage)}
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem
              icon="📊"
              title="Proficiency Level"
              subtitle={getProficiencyLabel(preferences.defaultProficiencyLevel)}
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem
              icon="🎚️"
              title="Word Density"
              subtitle={`${Math.round(preferences.defaultWordDensity * 100)}%`}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        {/* Reader Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reader</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="🎨"
              title="Appearance"
              subtitle="Theme, fonts, and layout"
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem
              icon="📱"
              title="Display"
              subtitle="Brightness and orientation"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="🔔"
              title="Notifications"
              subtitle={preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem
              icon="💾"
              title="Data & Storage"
              onPress={() => navigation.navigate('Settings')}
            />
            <MenuItem icon="📤" title="Export Data" onPress={() => {}} />
            <MenuItem icon="ℹ️" title="About Xenolexia" onPress={() => {}} />
          </View>
        </View>

        <Text style={styles.version}>Version 0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 12,
    width: 80,
  },
  avatarText: {
    fontSize: 40,
  },
  chevron: {
    color: '#9ca3af',
    fontSize: 24,
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  menuContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuItem: {
    alignItems: 'center',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuSubtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 2,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1f2937',
    fontSize: 24,
    fontWeight: '700',
  },
  version: {
    color: '#9ca3af',
    fontSize: 14,
    paddingVertical: 20,
    textAlign: 'center',
  },
});
