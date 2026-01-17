/*
  # NOVA Core Database Schema

  ## Overview
  Complete database schema for NOVA Core AI-powered fitness app with support for
  workout tracking, nutrition, cycle tracking, gamification, and community features.

  ## Tables Created

  ### 1. User Profiles (`user_profiles`)
  - Stores extended user information beyond auth
  - Fields: fitness goals, level, preferences, health data
  - Links to auth.users via user_id

  ### 2. Exercises (`exercises`)
  - Library of all available exercises
  - Fields: name, category, muscles targeted, difficulty, instructions
  - Includes video URLs and common mistakes

  ### 3. Workouts (`workouts`)
  - Individual workout sessions
  - Fields: user_id, date, duration, calories, notes
  - Tracks completed workouts

  ### 4. Workout Exercises (`workout_exercises`)
  - Exercises performed in each workout
  - Fields: workout_id, exercise_id, sets, reps, weight
  - Junction table for workouts and exercises

  ### 5. Progress Tracking (`progress_records`)
  - Body measurements and progress photos
  - Fields: weight, body_fat, measurements, photo URLs
  - Timeline tracking

  ### 6. Nutrition (`nutrition_logs`)
  - Daily meal and macro tracking
  - Fields: calories, protein, carbs, fats, meal details
  - Hydration tracking

  ### 7. Menstrual Cycle (`cycle_logs`)
  - Cycle phase tracking
  - Fields: phase, symptoms, energy level, mood
  - Adaptive workout recommendations

  ### 8. Badges (`badges`)
  - Achievement badges for gamification
  - Fields: name, description, icon, requirements

  ### 9. User Badges (`user_badges`)
  - Earned badges per user
  - Junction table with earned_at timestamp

  ### 10. Challenges (`challenges`)
  - Community challenges and competitions
  - Fields: name, description, start/end dates, goal

  ### 11. Challenge Participants (`challenge_participants`)
  - Users participating in challenges
  - Progress tracking per challenge

  ### 12. Leaderboard (`leaderboard_entries`)
  - Global and challenge-specific rankings
  - Real-time score tracking

  ### 13. Community Posts (`community_posts`)
  - Social feed for sharing progress
  - Fields: content, images, likes, comments

  ### 14. Post Likes (`post_likes`)
  - Like tracking for community engagement

  ## Security
  - RLS enabled on all tables
  - Policies ensure users only access their own data
  - Public read access for exercises and badges
  - Community features allow controlled sharing

  ## Important Notes
  - All timestamps use timestamptz for timezone support
  - Foreign keys with CASCADE for data integrity
  - Indexes on frequently queried columns
  - Default values for better UX
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text DEFAULT '',
  avatar_url text,
  fitness_goal text DEFAULT 'general_fitness',
  fitness_level text DEFAULT 'beginner',
  age int,
  gender text,
  height_cm decimal(5,2),
  weight_kg decimal(5,2),
  target_weight_kg decimal(5,2),
  dietary_preference text DEFAULT 'none',
  allergies text[] DEFAULT '{}',
  menstrual_tracking_enabled boolean DEFAULT false,
  cycle_length_days int DEFAULT 28,
  last_period_date date,
  notifications_enabled boolean DEFAULT true,
  workout_reminders boolean DEFAULT true,
  hydration_reminders boolean DEFAULT true,
  streak_count int DEFAULT 0,
  total_workouts int DEFAULT 0,
  total_minutes_exercised int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exercises library table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  difficulty text DEFAULT 'beginner',
  muscles_targeted text[] DEFAULT '{}',
  equipment_needed text[] DEFAULT '{}',
  description text,
  execution_steps text[] DEFAULT '{}',
  common_mistakes text[] DEFAULT '{}',
  video_url text,
  thumbnail_url text,
  calories_per_minute decimal(4,1) DEFAULT 5.0,
  is_bodyweight boolean DEFAULT true,
  requires_spotter boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'Workout Session',
  date date DEFAULT CURRENT_DATE,
  start_time timestamptz,
  end_time timestamptz,
  duration_minutes int,
  calories_burned int DEFAULT 0,
  workout_type text DEFAULT 'strength',
  intensity text DEFAULT 'moderate',
  notes text,
  ai_recognized boolean DEFAULT false,
  cycle_phase text,
  created_at timestamptz DEFAULT now()
);

-- Create workout exercises junction table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  order_index int DEFAULT 0,
  sets int DEFAULT 0,
  reps int DEFAULT 0,
  weight_kg decimal(6,2),
  duration_seconds int,
  distance_meters decimal(8,2),
  rest_seconds int DEFAULT 60,
  form_score int CHECK (form_score >= 0 AND form_score <= 100),
  ai_feedback text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create progress records table
CREATE TABLE IF NOT EXISTS progress_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  record_date date DEFAULT CURRENT_DATE,
  weight_kg decimal(5,2),
  body_fat_percentage decimal(4,2),
  chest_cm decimal(5,2),
  waist_cm decimal(5,2),
  hips_cm decimal(5,2),
  arms_cm decimal(5,2),
  thighs_cm decimal(5,2),
  photo_urls text[] DEFAULT '{}',
  notes text,
  energy_level int CHECK (energy_level >= 1 AND energy_level <= 5),
  mood text,
  created_at timestamptz DEFAULT now()
);

-- Create nutrition logs table
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date date DEFAULT CURRENT_DATE,
  meal_type text DEFAULT 'other',
  meal_name text,
  calories int DEFAULT 0,
  protein_g decimal(6,2) DEFAULT 0,
  carbs_g decimal(6,2) DEFAULT 0,
  fats_g decimal(6,2) DEFAULT 0,
  water_ml int DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create cycle logs table
CREATE TABLE IF NOT EXISTS cycle_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date date DEFAULT CURRENT_DATE,
  cycle_phase text NOT NULL,
  day_of_cycle int,
  is_period_day boolean DEFAULT false,
  flow_intensity text,
  symptoms text[] DEFAULT '{}',
  energy_level int CHECK (energy_level >= 1 AND energy_level <= 5),
  mood text,
  workout_modified boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  category text DEFAULT 'achievement',
  requirement_type text,
  requirement_value int,
  rarity text DEFAULT 'common',
  points int DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create user badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  challenge_type text DEFAULT 'workout_count',
  goal_value int NOT NULL,
  goal_unit text DEFAULT 'workouts',
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  is_global boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  max_participants int,
  reward_badge_id uuid REFERENCES badges(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_progress int DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Create leaderboard entries table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  leaderboard_type text DEFAULT 'global',
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  score int DEFAULT 0,
  rank int,
  period text DEFAULT 'all_time',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, leaderboard_type, period, challenge_id)
);

-- Create community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_urls text[] DEFAULT '{}',
  workout_id uuid REFERENCES workouts(id) ON DELETE SET NULL,
  likes_count int DEFAULT 0,
  comments_count int DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_progress_records_user_id ON progress_records(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id ON nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_date ON nutrition_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_cycle_logs_user_id ON cycle_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for exercises (public read)
CREATE POLICY "Anyone can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for workouts
CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON workouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON workouts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for workout_exercises
CREATE POLICY "Users can view own workout exercises"
  ON workout_exercises FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout exercises"
  ON workout_exercises FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises"
  ON workout_exercises FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout exercises"
  ON workout_exercises FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- RLS Policies for progress_records
CREATE POLICY "Users can view own progress"
  ON progress_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON progress_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for nutrition_logs
CREATE POLICY "Users can view own nutrition logs"
  ON nutrition_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs"
  ON nutrition_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs"
  ON nutrition_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition logs"
  ON nutrition_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for cycle_logs
CREATE POLICY "Users can view own cycle logs"
  ON cycle_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cycle logs"
  ON cycle_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycle logs"
  ON cycle_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycle logs"
  ON cycle_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view others badges for leaderboard"
  ON user_badges FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for challenges
CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_active = true OR created_by = auth.uid());

CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Challenge creators can update own challenges"
  ON challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for challenge_participants
CREATE POLICY "Users can view challenge participants"
  ON challenge_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join challenges"
  ON challenge_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON challenge_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for leaderboard_entries
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard_entries FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for community_posts
CREATE POLICY "Users can view public posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_likes
CREATE POLICY "Users can view post likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);