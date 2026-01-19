/**
 * Settings Slider - Reusable slider component
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
// TODO: Replace with actual Slider from @react-native-community/slider
// For now, using a placeholder implementation

interface SettingsSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
}

export function SettingsSlider({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step,
}: SettingsSliderProps): React.JSX.Element {
  // Calculate percentage for visual representation
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  // Placeholder UI - will be replaced with actual Slider component
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${percentage}%`}]} />
        <View style={[styles.thumb, {left: `${percentage}%`}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    position: 'relative',
  },
  fill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    top: -9,
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
