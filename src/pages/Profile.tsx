import { useEffect, useState } from 'react';
import { User, Settings, LogOut, Edit2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  full_name: string;
  fitness_goal: string;
  fitness_level: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  target_weight_kg: number;
  dietary_preference: string;
  menstrual_tracking_enabled: boolean;
  notifications_enabled: boolean;
  workout_reminders: boolean;
  hydration_reminders: boolean;
}

export function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        fitness_goal: data.fitness_goal || 'general_fitness',
        fitness_level: data.fitness_level || 'beginner',
        age: data.age || 0,
        gender: data.gender || '',
        height_cm: data.height_cm || 0,
        weight_kg: data.weight_kg || 0,
        target_weight_kg: data.target_weight_kg || 0,
        dietary_preference: data.dietary_preference || 'none',
        menstrual_tracking_enabled: data.menstrual_tracking_enabled || false,
        notifications_enabled: data.notifications_enabled || true,
        workout_reminders: data.workout_reminders || true,
        hydration_reminders: data.hydration_reminders || true,
      });
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    await supabase
      .from('user_profiles')
      .update(profile)
      .eq('user_id', user.id);

    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 h-32"></div>

        <div className="px-8 pb-8">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>

            <div className="flex space-x-3">
              {isEditing ? (
                <button
                  onClick={saveProfile}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="bg-red-100 text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.full_name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profile.height_cm || ''}
                    onChange={(e) => setProfile({ ...profile, height_cm: parseFloat(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profile.weight_kg || ''}
                    onChange={(e) => setProfile({ ...profile, weight_kg: parseFloat(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profile.target_weight_kg || ''}
                    onChange={(e) => setProfile({ ...profile, target_weight_kg: parseFloat(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fitness Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goal</label>
                  <select
                    value={profile.fitness_goal}
                    onChange={(e) => setProfile({ ...profile, fitness_goal: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="general_fitness">General Fitness</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="flexibility">Flexibility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
                  <select
                    value={profile.fitness_level}
                    onChange={(e) => setProfile({ ...profile, fitness_level: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                  <select
                    value={profile.dietary_preference}
                    onChange={(e) => setProfile({ ...profile, dietary_preference: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="none">No Preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                  </select>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.menstrual_tracking_enabled}
                    onChange={(e) => setProfile({ ...profile, menstrual_tracking_enabled: e.target.checked })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable menstrual cycle tracking</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.notifications_enabled}
                    onChange={(e) => setProfile({ ...profile, notifications_enabled: e.target.checked })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.workout_reminders}
                    onChange={(e) => setProfile({ ...profile, workout_reminders: e.target.checked })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Workout reminders</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.hydration_reminders}
                    onChange={(e) => setProfile({ ...profile, hydration_reminders: e.target.checked })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Hydration reminders</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
