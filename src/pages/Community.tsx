import { useEffect, useState } from 'react';
import { Trophy, Users, Target, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  goal_value: number;
  goal_unit: string;
  start_date: string;
  end_date: string;
  participants?: number;
  userProgress?: number;
  isJoined?: boolean;
}

export function Community() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, [user]);

  const loadChallenges = async () => {
    if (!user) return;

    const { data: challengesData } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('start_date', { ascending: false });

    if (challengesData) {
      const enriched = await Promise.all(
        challengesData.map(async (challenge) => {
          const { count } = await supabase
            .from('challenge_participants')
            .select('*', { count: 'exact', head: true })
            .eq('challenge_id', challenge.id);

          const { data: userParticipation } = await supabase
            .from('challenge_participants')
            .select('current_progress')
            .eq('challenge_id', challenge.id)
            .eq('user_id', user.id)
            .maybeSingle();

          return {
            ...challenge,
            participants: count || 0,
            userProgress: userParticipation?.current_progress || 0,
            isJoined: !!userParticipation,
          };
        })
      );

      setChallenges(enriched);
    }
    setLoading(false);
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) return;

    await supabase.from('challenge_participants').insert({
      challenge_id: challengeId,
      user_id: user.id,
      current_progress: 0,
    });

    loadChallenges();
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
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
        <h1 className="text-3xl font-bold text-gray-900">Community Challenges</h1>
        <p className="text-gray-600 mt-1">Join challenges and compete with others</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">{challenges.filter(c => c.isJoined).length}</p>
          <p className="text-sm text-gray-600">Active Challenges</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <Users className="w-8 h-8 text-teal-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">
            {challenges.reduce((sum, c) => sum + (c.participants || 0), 0)}
          </p>
          <p className="text-sm text-gray-600">Total Participants</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <Target className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-3xl font-bold text-gray-900">
            {challenges.filter(c => c.isJoined && c.userProgress >= c.goal_value).length}
          </p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      <div className="space-y-6">
        {challenges.map((challenge) => {
          const daysLeft = getDaysRemaining(challenge.end_date);
          const progress = challenge.isJoined
            ? Math.min((challenge.userProgress / challenge.goal_value) * 100, 100)
            : 0;

          return (
            <div key={challenge.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                  {challenge.isJoined ? (
                    <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-medium">
                      Joined
                    </span>
                  ) : (
                    <button
                      onClick={() => joinChallenge(challenge.id)}
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Goal</p>
                      <p className="font-semibold text-gray-900">
                        {challenge.goal_value} {challenge.goal_unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Days Left</p>
                      <p className="font-semibold text-gray-900">{daysLeft}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600">Participants</p>
                      <p className="font-semibold text-gray-900">{challenge.participants}</p>
                    </div>
                  </div>

                  {challenge.isJoined && (
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Your Progress</p>
                        <p className="font-semibold text-gray-900">
                          {challenge.userProgress}/{challenge.goal_value}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {challenge.isJoined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-teal-600">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-teal-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {challenges.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active challenges at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
