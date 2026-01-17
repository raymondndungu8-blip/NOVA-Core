import { useEffect, useState } from 'react';
import { Award, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
  earned: boolean;
  earned_at?: string;
}

export function Badges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadBadges();
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;

    const { data: allBadges } = await supabase
      .from('badges')
      .select('*')
      .order('points', { ascending: false });

    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', user.id);

    const earnedIds = new Set(userBadges?.map((ub) => ub.badge_id) || []);
    const earnedMap = new Map(userBadges?.map((ub) => [ub.badge_id, ub.earned_at]));

    const mergedBadges = allBadges?.map((badge) => ({
      ...badge,
      earned: earnedIds.has(badge.id),
      earned_at: earnedMap.get(badge.id),
    })) || [];

    setBadges(mergedBadges);
    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredBadges = badges.filter((badge) => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return true;
  });

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalPoints = badges.filter((b) => b.earned).reduce((sum, b) => sum + b.points, 0);

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
        <h1 className="text-3xl font-bold text-gray-900">Achievement Badges</h1>
        <p className="text-gray-600 mt-1">Collect badges as you progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Award className="w-8 h-8 text-teal-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">{earnedCount}</p>
          <p className="text-sm text-gray-600">Badges Earned</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <Lock className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-3xl font-bold text-gray-900">{badges.length - earnedCount}</p>
          <p className="text-sm text-gray-600">Badges Locked</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-lg">⭐</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalPoints}</p>
          <p className="text-sm text-gray-600">Total Points</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex space-x-2">
          {['all', 'earned', 'locked'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
              badge.earned ? getRarityColor(badge.rarity) : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{badge.earned ? badge.icon : '🔒'}</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                {badge.rarity}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{badge.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{badge.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{badge.points} points</span>
              {badge.earned && badge.earned_at && (
                <span className="text-xs text-gray-500">
                  Earned {new Date(badge.earned_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
