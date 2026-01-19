/**
 * Reader Settings Modal - Customize reading experience
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import {useReaderStore} from '@stores/readerStore';
import {SettingsSlider} from '@components/settings/SettingsSlider';

interface ReaderSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ReaderSettingsModal({
  visible,
  onClose,
}: ReaderSettingsModalProps): React.JSX.Element {
  const {settings, updateSettings} = useReaderStore();

  const themes = [
    {id: 'light', label: 'Light', bg: '#ffffff', text: '#1f2937'},
    {id: 'sepia', label: 'Sepia', bg: '#f4ecd8', text: '#5c4b37'},
    {id: 'dark', label: 'Dark', bg: '#1a1a2e', text: '#e5e7eb'},
  ];

  const fonts = [
    {id: 'Georgia', label: 'Serif'},
    {id: 'System', label: 'Sans'},
    {id: 'Courier', label: 'Mono'},
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Reader Settings</Text>

            {/* Theme Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Theme</Text>
              <View style={styles.themeRow}>
                {themes.map(theme => (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.themeOption,
                      {backgroundColor: theme.bg},
                      settings.theme === theme.id && styles.themeOptionSelected,
                    ]}
                    onPress={() => updateSettings({theme: theme.id as any})}>
                    <Text style={[styles.themeLabel, {color: theme.text}]}>
                      {theme.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Font Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Font</Text>
              <View style={styles.fontRow}>
                {fonts.map(font => (
                  <TouchableOpacity
                    key={font.id}
                    style={[
                      styles.fontOption,
                      settings.fontFamily === font.id && styles.fontOptionSelected,
                    ]}
                    onPress={() => updateSettings({fontFamily: font.id})}>
                    <Text
                      style={[
                        styles.fontLabel,
                        {fontFamily: font.id},
                        settings.fontFamily === font.id && styles.fontLabelSelected,
                      ]}>
                      {font.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Font Size */}
            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sectionTitle}>Font Size</Text>
                <Text style={styles.sliderValue}>{settings.fontSize}pt</Text>
              </View>
              <SettingsSlider
                value={settings.fontSize}
                onValueChange={value => updateSettings({fontSize: Math.round(value)})}
                minimumValue={12}
                maximumValue={28}
                step={1}
              />
            </View>

            {/* Line Height */}
            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sectionTitle}>Line Spacing</Text>
                <Text style={styles.sliderValue}>{settings.lineHeight.toFixed(1)}×</Text>
              </View>
              <SettingsSlider
                value={settings.lineHeight}
                onValueChange={value => updateSettings({lineHeight: value})}
                minimumValue={1.2}
                maximumValue={2.0}
                step={0.1}
              />
            </View>

            {/* Margins */}
            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sectionTitle}>Margins</Text>
                <Text style={styles.sliderValue}>{settings.marginHorizontal}px</Text>
              </View>
              <SettingsSlider
                value={settings.marginHorizontal}
                onValueChange={value => updateSettings({marginHorizontal: Math.round(value)})}
                minimumValue={12}
                maximumValue={48}
                step={4}
              />
            </View>

            {/* Word Density */}
            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sectionTitle}>Word Density</Text>
                <Text style={styles.sliderValue}>
                  {Math.round((settings.wordDensity || 0.3) * 100)}%
                </Text>
              </View>
              <Text style={styles.sectionDescription}>
                Percentage of words shown in target language
              </Text>
              <SettingsSlider
                value={settings.wordDensity || 0.3}
                onValueChange={value => updateSettings({wordDensity: value})}
                minimumValue={0.1}
                maximumValue={0.9}
                step={0.1}
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionSelected: {
    borderColor: '#0ea5e9',
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  fontRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fontOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  fontOptionSelected: {
    backgroundColor: '#e0f2fe',
  },
  fontLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  fontLabelSelected: {
    color: '#0369a1',
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
