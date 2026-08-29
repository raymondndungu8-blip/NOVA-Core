import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../auth/authStore';
import { MainTabs } from './MainTabs';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { AuthStackParamList } from './types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Show visible loading screen instead of null (fixes white screen)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>NOVA Core</Text>
        <Text style={styles.loadingSubtext}>Loading…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? ('100vh' as any) : undefined,
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  loadingSubtext: {
    color: colors.text.secondary,
    fontSize: 16,
    marginTop: 8,
  },
});
