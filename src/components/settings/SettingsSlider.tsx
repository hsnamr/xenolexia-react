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
  onValueChange: _onValueChange,
  minimumValue,
  maximumValue,
  step: _step,
}: SettingsSliderProps): React.JSX.Element {
  // Calculate percentage for visual representation
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  // TODO: Implement actual slider interaction using _onValueChange and _step
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
  fill: {
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
    height: '100%',
  },
  thumb: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    elevation: 4,
    height: 24,
    marginLeft: -12,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    top: -9,
    width: 24,
  },
  track: {
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    height: 6,
    position: 'relative',
  },
});
