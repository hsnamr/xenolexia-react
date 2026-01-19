/**
 * Main application navigator
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import type {RootStackParamList, MainTabsParamList} from '@types/index';

// Screens (to be implemented)
import {LibraryScreen} from '@screens/Library/LibraryScreen';
import {VocabularyScreen} from '@screens/Vocabulary/VocabularyScreen';
import {StatisticsScreen} from '@screens/Statistics/StatisticsScreen';
import {ProfileScreen} from '@screens/Profile/ProfileScreen';
import {ReaderScreen} from '@screens/Reader/ReaderScreen';
import {SettingsScreen} from '@screens/Settings/SettingsScreen';
import {OnboardingScreen} from '@screens/Onboarding/OnboardingScreen';

// Icons (placeholder - will use actual icons)
import {TabBarIcon} from '@components/common/TabBarIcon';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: 'Library',
          tabBarIcon: ({color, size}) => <TabBarIcon name="library" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Vocabulary"
        component={VocabularyScreen}
        options={{
          tabBarLabel: 'Vocabulary',
          tabBarIcon: ({color, size}) => <TabBarIcon name="vocabulary" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({color, size}) => <TabBarIcon name="stats" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => <TabBarIcon name="profile" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  // TODO: Check if user has completed onboarding
  const hasCompletedOnboarding = true; // Will come from store

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasCompletedOnboarding ? 'MainTabs' : 'Onboarding'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
