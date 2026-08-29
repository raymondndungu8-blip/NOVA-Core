import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, WorkoutStackParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { WorkoutLibraryScreen } from '../screens/workout/WorkoutLibraryScreen';
import { ExerciseDetailScreen } from '../screens/workout/ExerciseDetailScreen';
import { ScanWorkoutScreen } from '../screens/workout/ScanWorkoutScreen';
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { NutritionScreen } from '../screens/nutrition/NutritionScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();
const WorkoutStack = createNativeStackNavigator<WorkoutStackParamList>();

function WorkoutStackNavigator() {
  return (
    <WorkoutStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background.DEFAULT },
        headerTintColor: colors.text.primary,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        contentStyle: { backgroundColor: colors.background.DEFAULT },
        headerShadowVisible: false,
      }}
    >
      <WorkoutStack.Screen
        name="WorkoutLibrary"
        component={WorkoutLibraryScreen}
        options={{ headerShown: false }}
      />
      <WorkoutStack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ title: 'Exercise' }}
      />
      <WorkoutStack.Screen
        name="ScanWorkout"
        component={ScanWorkoutScreen}
        options={{ title: 'AI Scan', headerBackTitle: 'Back' }}
      />
    </WorkoutStack.Navigator>
  );
}

type TabIconProps = { label: string; focused: boolean };

function TabIcon({ label, focused }: TabIconProps) {
  const iconMap: Record<string, string> = {
    Home: '⌂',
    Workout: '⊞',
    Progress: '◎',
    Nutrition: '⊕',
    Profile: '◯',
  };
  const icon = iconMap[label] ?? '•';

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>{icon}</Text>
      <Text style={[styles.iconLabel, focused && styles.iconLabelFocused]}>{label}</Text>
    </View>
  );
}

// Special center Scan button
function ScanTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.scanContainer}>
      <View style={[styles.scanBtn, focused && styles.scanBtnFocused]}>
        <Text style={styles.scanIcon}>+</Text>
      </View>
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.electric.DEFAULT,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Workout" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused }) => <ScanTabIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Nutrition" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.card,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    gap: 2,
  },
  iconContainerFocused: {},
  iconText: {
    fontSize: 22,
    color: colors.text.muted,
    lineHeight: 26,
  },
  iconTextFocused: {
    color: colors.electric.DEFAULT,
  },
  iconLabel: {
    fontSize: 9,
    color: colors.text.muted,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  iconLabelFocused: {
    color: colors.electric.DEFAULT,
    fontWeight: '700',
  },
  // Scan / center button
  scanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  scanBtn: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: colors.glass.DEFAULT,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.electric.glow,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  scanBtnFocused: {
    backgroundColor: colors.electric.DEFAULT,
    borderColor: colors.electric.DEFAULT,
    shadowOpacity: 0.8,
  },
  scanIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 32,
    marginTop: -2,
  },
});
