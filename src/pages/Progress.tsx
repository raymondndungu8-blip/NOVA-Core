import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProgressRecord {
  id: string;
  record_date: string;
  weight_kg: number;
  body_fat_percentage: number;
  energy_level: number;
  notes: string;
}

export function Progress() {
  const { user } = useAuth();
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    weight_kg: '',
    body_fat_percentage: '',
    energy_level: 3,
    notes: '',
  });

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('progress_records')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', { ascending: false });

    if (data) {
      setRecords(data);
    }
    setLoading(false);
  };

  const saveProgress = async () => {
    if (!user) return;

    await supabase.from('progress_records').insert({
      user_id: user.id,
      weight_kg: parseFloat(newRecord.weight_kg) || null,
      body_fat_percentage: parseFloat(newRecord.body_fat_percentage) || null,
      energy_level: newRecord.energy_level,
      notes: newRecord.notes,
    });

    setNewRecord({ weight_kg: '', body_fat_percentage: '', energy_level: 3, notes: '' });
    setShowAddModal(false);
    loadProgress();
  };

  const getTrend = (current: number, previous: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-green-500" />;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your fitness journey</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Log Progress
        </button>
      </div>

      {records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Current Weight</h3>
              {records.length > 1 && getTrend(records[0].weight_kg, records[1].weight_kg)}
            </div>
            <p className="text-3xl font-bold text-gray-900">{records[0].weight_kg} kg</p>
            {records.length > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                {Math.abs(records[0].weight_kg - records[1].weight_kg).toFixed(1)} kg change
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Body Fat %</h3>
              {records.length > 1 && getTrend(records[0].body_fat_percentage, records[1].body_fat_percentage)}
            </div>
            <p className="text-3xl font-bold text-gray-900">{records[0].body_fat_percentage}%</p>
            {records.length > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                {Math.abs(records[0].body_fat_percentage - records[1].body_fat_percentage).toFixed(1)}% change
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Energy Level</h3>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-8 w-8 rounded ${
                    level <= records[0].energy_level ? 'bg-teal-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">{records[0].energy_level}/5</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Progress History</h2>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No progress records yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Log Your First Progress
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {records.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {new Date(record.record_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="text-lg font-semibold text-gray-900">{record.weight_kg} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Body Fat</p>
                        <p className="text-lg font-semibold text-gray-900">{record.body_fat_percentage}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Energy</p>
                        <p className="text-lg font-semibold text-gray-900">{record.energy_level}/5</p>
                      </div>
                    </div>

                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-3 italic">{record.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Progress</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newRecord.weight_kg}
                  onChange={(e) => setNewRecord({ ...newRecord, weight_kg: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Fat %
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newRecord.body_fat_percentage}
                  onChange={(e) => setNewRecord({ ...newRecord, body_fat_percentage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level: {newRecord.energy_level}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newRecord.energy_level}
                  onChange={(e) => setNewRecord({ ...newRecord, energy_level: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="How are you feeling today?"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveProgress}
                className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
