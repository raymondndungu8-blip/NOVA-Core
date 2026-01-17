import { useEffect, useState } from 'react';
import { Apple, Droplet, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface NutritionLog {
  id: string;
  meal_type: string;
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  water_ml: number;
  log_date: string;
}

export function Nutrition() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({
    meal_type: 'breakfast',
    meal_name: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fats_g: '',
    water_ml: '0',
  });

  useEffect(() => {
    loadNutrition();
  }, [user]);

  const loadNutrition = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('log_date', today)
      .order('created_at', { ascending: false });

    if (data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const saveMeal = async () => {
    if (!user) return;

    await supabase.from('nutrition_logs').insert({
      user_id: user.id,
      meal_type: newLog.meal_type,
      meal_name: newLog.meal_name,
      calories: parseInt(newLog.calories) || 0,
      protein_g: parseFloat(newLog.protein_g) || 0,
      carbs_g: parseFloat(newLog.carbs_g) || 0,
      fats_g: parseFloat(newLog.fats_g) || 0,
      water_ml: parseInt(newLog.water_ml) || 0,
    });

    setNewLog({
      meal_type: 'breakfast',
      meal_name: '',
      calories: '',
      protein_g: '',
      carbs_g: '',
      fats_g: '',
      water_ml: '0',
    });
    setShowAddModal(false);
    loadNutrition();
  };

  const addWater = async (amount: number) => {
    if (!user) return;

    await supabase.from('nutrition_logs').insert({
      user_id: user.id,
      meal_type: 'water',
      water_ml: amount,
    });

    loadNutrition();
  };

  const todayCalories = logs.reduce((sum, log) => sum + log.calories, 0);
  const todayProtein = logs.reduce((sum, log) => sum + log.protein_g, 0);
  const todayCarbs = logs.reduce((sum, log) => sum + log.carbs_g, 0);
  const todayFats = logs.reduce((sum, log) => sum + log.fats_g, 0);
  const todayWater = logs.reduce((sum, log) => sum + log.water_ml, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracker</h1>
          <p className="text-gray-600 mt-1">Log your meals and hydration</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Log Meal</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Calories</p>
          <p className="text-2xl font-bold text-gray-900">{todayCalories}</p>
          <p className="text-xs text-gray-500">of 2000 kcal</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Protein</p>
          <p className="text-2xl font-bold text-teal-600">{todayProtein.toFixed(1)}g</p>
          <p className="text-xs text-gray-500">of 150g</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Carbs</p>
          <p className="text-2xl font-bold text-yellow-600">{todayCarbs.toFixed(1)}g</p>
          <p className="text-xs text-gray-500">of 250g</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Fats</p>
          <p className="text-2xl font-bold text-orange-600">{todayFats.toFixed(1)}g</p>
          <p className="text-xs text-gray-500">of 70g</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Water</p>
          <p className="text-2xl font-bold text-blue-600">{(todayWater / 1000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500">of 2.0L</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Hydration</h2>
        <div className="flex flex-wrap gap-3">
          {[250, 500, 750, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Droplet className="w-4 h-4" />
              <span className="font-medium">+{amount}ml</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Today's Meals</h2>
        </div>

        {logs.filter(l => l.meal_type !== 'water').length === 0 ? (
          <div className="p-12 text-center">
            <Apple className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No meals logged today</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.filter(l => l.meal_type !== 'water').map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium capitalize">
                        {log.meal_type}
                      </span>
                      <h3 className="font-bold text-gray-900">{log.meal_name}</h3>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-600">Calories</p>
                        <p className="font-semibold text-gray-900">{log.calories}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Protein</p>
                        <p className="font-semibold text-teal-600">{log.protein_g}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Carbs</p>
                        <p className="font-semibold text-yellow-600">{log.carbs_g}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Fats</p>
                        <p className="font-semibold text-orange-600">{log.fats_g}g</p>
                      </div>
                    </div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Meal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                <select
                  value={newLog.meal_type}
                  onChange={(e) => setNewLog({ ...newLog, meal_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Name</label>
                <input
                  type="text"
                  value={newLog.meal_name}
                  onChange={(e) => setNewLog({ ...newLog, meal_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Chicken Salad"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    value={newLog.calories}
                    onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLog.protein_g}
                    onChange={(e) => setNewLog({ ...newLog, protein_g: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLog.carbs_g}
                    onChange={(e) => setNewLog({ ...newLog, carbs_g: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fats (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLog.fats_g}
                    onChange={(e) => setNewLog({ ...newLog, fats_g: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
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
                onClick={saveMeal}
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
