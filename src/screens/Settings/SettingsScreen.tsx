/**
 * Settings Screen - App configuration
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {useUserStore} from '@stores/userStore';
import {SettingsSlider} from '@components/settings/SettingsSlider';
import {SettingsSelect} from '@components/settings/SettingsSelect';

export function SettingsScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {preferences, updatePreferences} = useUserStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.backButton} onPress={() => navigation.goBack()}>
          ← Back
        </Text>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Word Density */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Word Replacement Density</Text>
              <Text style={styles.settingValue}>
                {Math.round(preferences.defaultWordDensity * 100)}%
              </Text>
            </View>
            <Text style={styles.settingDescription}>
              Percentage of eligible words to replace with target language
            </Text>
            <SettingsSlider
              value={preferences.defaultWordDensity}
              onValueChange={value => updatePreferences({defaultWordDensity: value})}
              minimumValue={0.1}
              maximumValue={0.9}
              step={0.1}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Daily Goal</Text>
              <Text style={styles.settingValue}>{preferences.dailyGoal} min</Text>
            </View>
            <SettingsSlider
              value={preferences.dailyGoal}
              onValueChange={value => updatePreferences({dailyGoal: Math.round(value)})}
              minimumValue={5}
              maximumValue={60}
              step={5}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Daily Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get reminded to read every day
                </Text>
              </View>
              <Switch
                value={preferences.notificationsEnabled}
                onValueChange={value => updatePreferences({notificationsEnabled: value})}
                trackColor={{false: '#e5e7eb', true: '#0ea5e9'}}
              />
            </View>
          </View>
        </View>

        {/* Reader Defaults */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reader Defaults</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Default Theme</Text>
            <SettingsSelect
              value={preferences.readerSettings.theme}
              options={[
                {value: 'light', label: 'Light'},
                {value: 'dark', label: 'Dark'},
                {value: 'sepia', label: 'Sepia'},
              ]}
              onSelect={value =>
                updatePreferences({
                  readerSettings: {...preferences.readerSettings, theme: value as any},
                })
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Font Size</Text>
              <Text style={styles.settingValue}>{preferences.readerSettings.fontSize}pt</Text>
            </View>
            <SettingsSlider
              value={preferences.readerSettings.fontSize}
              onValueChange={value =>
                updatePreferences({
                  readerSettings: {...preferences.readerSettings, fontSize: Math.round(value)},
                })
              }
              minimumValue={12}
              maximumValue={28}
              step={1}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Line Height</Text>
              <Text style={styles.settingValue}>{preferences.readerSettings.lineHeight.toFixed(1)}×</Text>
            </View>
            <SettingsSlider
              value={preferences.readerSettings.lineHeight}
              onValueChange={value =>
                updatePreferences({
                  readerSettings: {...preferences.readerSettings, lineHeight: value},
                })
              }
              minimumValue={1.2}
              maximumValue={2.0}
              step={0.1}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Data</Text>
          
          <Text style={styles.dangerButton}>Export All Data</Text>
          <Text style={[styles.dangerButton, styles.destructive]}>Clear All Data</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 12,
  },
  dangerTitle: {
    color: '#ef4444',
  },
  dangerButton: {
    fontSize: 16,
    color: '#0ea5e9',
    paddingVertical: 12,
  },
  destructive: {
    color: '#ef4444',
  },
});
