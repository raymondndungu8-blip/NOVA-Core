import { useEffect, useState } from 'react';
import { Calendar, Heart, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CycleLog {
  id: string;
  log_date: string;
  cycle_phase: string;
  day_of_cycle: number;
  is_period_day: boolean;
  symptoms: string[];
  energy_level: number;
  mood: string;
  notes: string;
}

export function CycleTracking() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CycleLog[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadCycleLogs();
  }, [user]);

  const loadCycleLogs = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('cycle_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .limit(30);

    if (data && data.length > 0) {
      setLogs(data);
      setCurrentPhase(data[0].cycle_phase);
    }
    setLoading(false);
  };

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'menstruation':
        return {
          name: 'Menstruation',
          color: 'bg-red-100 text-red-700',
          recommendations: ['Gentle movement', 'Hydration', 'Iron-rich foods', 'Rest'],
        };
      case 'follicular':
        return {
          name: 'Follicular',
          color: 'bg-green-100 text-green-700',
          recommendations: ['Higher intensity workouts', 'Strength training', 'New skills', 'Energy boost'],
        };
      case 'ovulation':
        return {
          name: 'Ovulation',
          color: 'bg-yellow-100 text-yellow-700',
          recommendations: ['Peak energy', 'HIIT workouts', 'Social activities', 'Thorough warm-up'],
        };
      case 'luteal':
        return {
          name: 'Luteal',
          color: 'bg-blue-100 text-blue-700',
          recommendations: ['Moderate intensity', 'Magnesium-rich foods', 'Recovery focus', 'Mindfulness'],
        };
      default:
        return {
          name: 'Unknown',
          color: 'bg-gray-100 text-gray-700',
          recommendations: [],
        };
    }
  };

  const phaseInfo = getPhaseInfo(currentPhase);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cycle Tracking</h1>
          <p className="text-gray-600 mt-1">Adapt your workouts to your cycle</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Log Today
        </button>
      </div>

      {currentPhase && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-teal-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Current Phase</h2>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mt-2 ${phaseInfo.color}`}>
                {phaseInfo.name}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Recommended for This Phase</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {phaseInfo.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-teal-50 rounded-lg p-4">
                  <Activity className="w-5 h-5 text-teal-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Cycle History</h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No cycle logs yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Start Tracking
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => {
              const info = getPhaseInfo(log.cycle_phase);
              return (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(log.log_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${info.color}`}>
                        {info.name} - Day {log.day_of_cycle}
                      </span>
                    </div>
                    {log.is_period_day && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        Period
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-600">Energy</p>
                      <p className="text-sm font-semibold text-gray-900">{log.energy_level}/5</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Mood</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">{log.mood || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Symptoms</p>
                      <p className="text-sm font-semibold text-gray-900">{log.symptoms.length}</p>
                    </div>
                  </div>

                  {log.notes && (
                    <p className="text-sm text-gray-600 mt-3 italic">{log.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
