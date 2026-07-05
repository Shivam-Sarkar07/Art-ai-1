/**
 * Art AI – Root App component.
 *
 * Wraps the navigator in SafeAreaProvider. The auth-aware root navigator
 * lives in src/navigation/AppNavigator.tsx.
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@navigation/AppNavigator';
import { colors } from '@theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
