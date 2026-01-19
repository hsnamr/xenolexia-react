/**
 * Profile Screen - User settings and preferences
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {useUserStore} from '@stores/userStore';

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
  const navigation = useNavigation();
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
              onPress={() => navigation.navigate('LanguageSettings')}
            />
            <MenuItem
              icon="📊"
              title="Proficiency Level"
              subtitle={getProficiencyLabel(preferences.defaultProficiencyLevel)}
              onPress={() => navigation.navigate('LanguageSettings')}
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
            <MenuItem
              icon="📤"
              title="Export Data"
              onPress={() => {}}
            />
            <MenuItem
              icon="ℹ️"
              title="About Xenolexia"
              onPress={() => {}}
            />
          </View>
        </View>

        <Text style={styles.version}>Version 0.1.0</Text>
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
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#9ca3af',
  },
  version: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    paddingVertical: 20,
  },
});
