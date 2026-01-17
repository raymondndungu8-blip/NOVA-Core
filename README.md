# NOVA Core - AI-Powered Fitness App

A comprehensive, next-generation fitness application that leverages AI-powered camera technology to recognize exercises, provide real-time form feedback, and guide users through personalized workouts.

## Features

### Core Functionality
- **AI Camera-Based Workout Recognition**: Real-time exercise detection and form scoring
- **Comprehensive Exercise Library**: 15+ exercises across multiple categories (strength, cardio, flexibility, core)
- **Interactive Workout Tracking**: Set and rep counting with AI feedback
- **Progress Monitoring**: Track weight, body measurements, energy levels, and more
- **Gamification System**: Earn badges, maintain streaks, and complete challenges

### Health & Wellness
- **Nutrition Tracking**: Log meals with macro tracking (protein, carbs, fats, calories)
- **Hydration Monitoring**: Quick-add water intake with daily goals
- **Menstrual Cycle Tracking**: Phase-based workout recommendations and symptom logging
- **Personalized Recommendations**: AI-driven exercise and nutrition suggestions based on cycle phase

### Community & Social
- **Global Challenges**: Join community fitness challenges
- **Leaderboards**: Compete with other users
- **Progress Sharing**: Share achievements and milestones
- **Challenge Tracking**: Monitor your progress in real-time

### User Experience
- **Beautiful, Modern UI**: Clean design with calming teal and green color palette
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility Features**: High contrast modes, scalable fonts, clear navigation
- **Real-time Dashboard**: Activity rings, streak counters, and quick stats

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **State Management**: React Context API

## Database Schema

The app uses a comprehensive Supabase database with the following tables:

- `user_profiles` - Extended user information and preferences
- `exercises` - Exercise library with details and instructions
- `workouts` - Workout session records
- `workout_exercises` - Junction table for exercises in workouts
- `progress_records` - Body measurements and progress tracking
- `nutrition_logs` - Meal and hydration tracking
- `cycle_logs` - Menstrual cycle phase and symptom tracking
- `badges` - Achievement badges
- `user_badges` - User-earned badges
- `challenges` - Community challenges
- `challenge_participants` - Challenge participation tracking
- `leaderboard_entries` - Global and challenge leaderboards
- `community_posts` - Social feed posts
- `post_likes` - Post engagement tracking

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. The database migrations have already been applied. Your database includes:
   - All necessary tables with proper indexes
   - Row Level Security (RLS) policies
   - Sample exercises (15 exercises)
   - Sample badges (10 achievement badges)
   - Global challenges (3 active challenges)

### Running the App

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Key Features Explained

### AI Camera Scanning
The camera scanning feature uses the device camera to:
1. Detect and recognize exercises in real-time
2. Provide form feedback and corrections
3. Count reps and sets automatically
4. Score form accuracy (0-100)
5. Save workout data with AI insights

### Dashboard
The dashboard provides:
- Activity rings for workouts, calories, and hydration
- Current streak counter
- Total workouts and badges earned
- Quick actions to start workouts or view progress

### Progress Tracking
Users can log:
- Weight and body measurements
- Body fat percentage
- Energy levels (1-5 scale)
- Progress photos
- Personal notes

### Nutrition & Hydration
- Log meals by type (breakfast, lunch, dinner, snack)
- Track macros (protein, carbs, fats)
- Quick-add water intake (250ml, 500ml, 750ml, 1L)
- Daily goals and progress visualization

### Menstrual Cycle Tracking
- Log cycle phase and symptoms
- Receive phase-specific workout recommendations:
  - **Menstruation**: Gentle movement, hydration, rest
  - **Follicular**: Higher intensity, strength training
  - **Ovulation**: Peak energy, HIIT workouts
  - **Luteal**: Moderate intensity, recovery focus
- Track energy levels and mood

### Badges & Achievements
- Earn badges for milestones (first workout, streaks, etc.)
- Badge rarities: Common, Uncommon, Rare, Epic, Legendary
- Points system for gamification
- Filter badges by earned/locked status

### Community Challenges
- Join global fitness challenges
- Track your progress in real-time
- Compete with other users
- View participant counts and leaderboards

## Security & Privacy

- **Row Level Security (RLS)**: All tables protected with proper policies
- **Authentication**: Secure email/password authentication via Supabase
- **Data Isolation**: Users can only access their own data
- **Privacy by Design**: Granular consent controls for all features
- **Encrypted Storage**: All sensitive data encrypted at rest

## Design Principles

### Color Palette
- **Primary**: Teal (#0D9488) - Health, vitality, trust
- **Secondary**: Emerald (#10B981) - Growth, wellness
- **Accents**: Orange, Yellow, Blue for metrics
- **Neutral**: Gray scale for text and backgrounds

### Accessibility
- High contrast mode support
- Scalable font sizes
- Clear navigation structure
- Descriptive labels and ARIA attributes
- Keyboard navigation support

## Future Enhancements

The app is designed to support future additions:
- Social feed with posts and comments
- AI-powered meal planning
- Wearable device integration (Apple Health, Google Fit)
- Video exercise demonstrations
- Voice coaching
- Advanced analytics and insights
- Custom workout plans
- Export data functionality

## License

This project is built for demonstration and educational purposes.

## Support

For issues or questions, please refer to the comprehensive product design document provided.
