import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: NavigatorScreenParams<WorkoutStackParamList>;
  Progress: undefined;
  Nutrition: undefined;
  Profile: undefined;
};

export type WorkoutStackParamList = {
  WorkoutLibrary: undefined;
  ExerciseDetail: { exerciseId: string };
  ScanWorkout: undefined;
};

export type RootStackParamList = AuthStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList {}
  }
}
