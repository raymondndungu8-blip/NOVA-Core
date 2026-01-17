import { useEffect, useState } from 'react';
import { Flame, Dumbbell, Trophy, Target, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  streak: number;
  totalWorkouts: number;
  weekWorkouts: number;
  badges: number;
  todayCalories: number;
  todayWater: number;
}

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    streak: 0,
    totalWorkouts: 0,
    weekWorkouts: 0,
    badges: 0,
    todayCalories: 0,
    todayWater: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('streak_count, total_workouts')
      .eq('user_id', user.id)
      .maybeSingle();

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: weekWorkouts } = await supabase
      .from('workouts')
      .select('id')
      .eq('user_id', user.id)
      .gte('date', weekAgo);

    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', user.id);

    const { data: nutrition } = await supabase
      .from('nutrition_logs')
      .select('calories, water_ml')
      .eq('user_id', user.id)
      .eq('log_date', today);

    const todayCalories = nutrition?.reduce((sum, log) => sum + log.calories, 0) || 0;
    const todayWater = nutrition?.reduce((sum, log) => sum + log.water_ml, 0) || 0;

    setStats({
      streak: profile?.streak_count || 0,
      totalWorkouts: profile?.total_workouts || 0,
      weekWorkouts: weekWorkouts?.length || 0,
      badges: userBadges?.length || 0,
      todayCalories,
      todayWater,
    });

    setLoading(false);
  };

  const ActivityRing = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28">
          <svg className="transform -rotate-90" width="112" height="112">
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-xs text-gray-500">of {max}</span>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 mt-2">{label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-1">Let's crush your fitness goals today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.streak}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
            <p className="text-sm text-gray-600">Total Workouts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.badges}</p>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Activity</h2>
        <div className="flex justify-around flex-wrap gap-6">
          <ActivityRing label="Workouts" value={stats.weekWorkouts} max={5} color="#0D9488" />
          <ActivityRing label="Calories" value={Math.round(stats.todayCalories / 100)} max={20} color="#F59E0B" />
          <ActivityRing label="Water (L)" value={Math.round(stats.todayWater / 250)} max={8} color="#3B82F6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onNavigate('scan')}
          className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow"
        >
          <Target className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Start Workout</h3>
          <p className="text-teal-50">Use AI camera to track your exercises</p>
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow text-left"
        >
          <TrendingUp className="w-12 h-12 text-teal-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">View Progress</h3>
          <p className="text-gray-600">Track your fitness journey</p>
        </button>

        <button
          onClick={() => onNavigate('workouts')}
          className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow text-left"
        >
          <Dumbbell className="w-12 h-12 text-teal-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Browse Exercises</h3>
          <p className="text-gray-600">Explore our exercise library</p>
        </button>

        <button
          onClick={() => onNavigate('community')}
          className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow text-left"
        >
          <Calendar className="w-12 h-12 text-teal-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Challenges</h3>
          <p className="text-gray-600">Compete with the community</p>
        </button>
      </div>
    </div>
  );
}
