export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url: string | null
          fitness_goal: string
          fitness_level: string
          age: number | null
          gender: string | null
          height_cm: number | null
          weight_kg: number | null
          target_weight_kg: number | null
          dietary_preference: string
          allergies: string[]
          menstrual_tracking_enabled: boolean
          cycle_length_days: number
          last_period_date: string | null
          notifications_enabled: boolean
          workout_reminders: boolean
          hydration_reminders: boolean
          streak_count: number
          total_workouts: number
          total_minutes_exercised: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string
          avatar_url?: string | null
          fitness_goal?: string
          fitness_level?: string
          age?: number | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          target_weight_kg?: number | null
          dietary_preference?: string
          allergies?: string[]
          menstrual_tracking_enabled?: boolean
          cycle_length_days?: number
          last_period_date?: string | null
          notifications_enabled?: boolean
          workout_reminders?: boolean
          hydration_reminders?: boolean
          streak_count?: number
          total_workouts?: number
          total_minutes_exercised?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          avatar_url?: string | null
          fitness_goal?: string
          fitness_level?: string
          age?: number | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          target_weight_kg?: number | null
          dietary_preference?: string
          allergies?: string[]
          menstrual_tracking_enabled?: boolean
          cycle_length_days?: number
          last_period_date?: string | null
          notifications_enabled?: boolean
          workout_reminders?: boolean
          hydration_reminders?: boolean
          streak_count?: number
          total_workouts?: number
          total_minutes_exercised?: number
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: string
          subcategory: string | null
          difficulty: string
          muscles_targeted: string[]
          equipment_needed: string[]
          description: string | null
          execution_steps: string[]
          common_mistakes: string[]
          video_url: string | null
          thumbnail_url: string | null
          calories_per_minute: number
          is_bodyweight: boolean
          requires_spotter: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          subcategory?: string | null
          difficulty?: string
          muscles_targeted?: string[]
          equipment_needed?: string[]
          description?: string | null
          execution_steps?: string[]
          common_mistakes?: string[]
          video_url?: string | null
          thumbnail_url?: string | null
          calories_per_minute?: number
          is_bodyweight?: boolean
          requires_spotter?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          subcategory?: string | null
          difficulty?: string
          muscles_targeted?: string[]
          equipment_needed?: string[]
          description?: string | null
          execution_steps?: string[]
          common_mistakes?: string[]
          video_url?: string | null
          thumbnail_url?: string | null
          calories_per_minute?: number
          is_bodyweight?: boolean
          requires_spotter?: boolean
          created_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          start_time: string | null
          end_time: string | null
          duration_minutes: number | null
          calories_burned: number
          workout_type: string
          intensity: string
          notes: string | null
          ai_recognized: boolean
          cycle_phase: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          date?: string
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          calories_burned?: number
          workout_type?: string
          intensity?: string
          notes?: string | null
          ai_recognized?: boolean
          cycle_phase?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          calories_burned?: number
          workout_type?: string
          intensity?: string
          notes?: string | null
          ai_recognized?: boolean
          cycle_phase?: string | null
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          category: string
          requirement_type: string | null
          requirement_value: number | null
          rarity: string
          points: number
          created_at: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string | null
          challenge_type: string
          goal_value: number
          goal_unit: string
          start_date: string
          end_date: string
          is_active: boolean
          is_global: boolean
          created_by: string | null
          max_participants: number | null
          reward_badge_id: string | null
          created_at: string
        }
      }
      nutrition_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          meal_type: string
          meal_name: string | null
          calories: number
          protein_g: number
          carbs_g: number
          fats_g: number
          water_ml: number
          notes: string | null
          created_at: string
        }
      }
      cycle_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          cycle_phase: string
          day_of_cycle: number | null
          is_period_day: boolean
          flow_intensity: string | null
          symptoms: string[]
          energy_level: number | null
          mood: string | null
          workout_modified: boolean
          notes: string | null
          created_at: string
        }
      }
    }
  }
}
