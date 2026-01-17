import { useEffect, useState } from 'react';
import { Search, Filter, Dumbbell, Heart, Flame, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  muscles_targeted: string[];
  description: string;
  is_bodyweight: boolean;
  calories_per_minute: number;
}

export function WorkoutLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, selectedCategory, selectedDifficulty, searchQuery]);

  const loadExercises = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (!error && data) {
      setExercises(data);
    }
    setLoading(false);
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((ex) => ex.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((ex) => ex.difficulty === selectedDifficulty);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.description?.toLowerCase().includes(query) ||
          ex.muscles_targeted.some((m) => m.toLowerCase().includes(query))
      );
    }

    setFilteredExercises(filtered);
  };

  const categories = [
    { id: 'all', label: 'All', icon: Dumbbell },
    { id: 'strength', label: 'Strength', icon: Dumbbell },
    { id: 'cardio', label: 'Cardio', icon: Heart },
    { id: 'flexibility', label: 'Flexibility', icon: Brain },
    { id: 'core', label: 'Core', icon: Flame },
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
        <p className="text-gray-600 mt-1">Browse and learn {exercises.length} exercises</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search exercises, muscles, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{exercise.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {exercise.muscles_targeted.slice(0, 3).map((muscle, idx) => (
                <span key={idx} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded">
                  {muscle}
                </span>
              ))}
              {exercise.muscles_targeted.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{exercise.muscles_targeted.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {exercise.is_bodyweight ? 'Bodyweight' : 'Equipment'}
              </span>
              <span className="text-gray-500">{exercise.calories_per_minute} cal/min</span>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No exercises found matching your criteria</p>
        </div>
      )}

      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedExercise.name}</h2>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <span className={`inline-block px-3 py-1 rounded text-sm font-medium mb-4 ${getDifficultyColor(selectedExercise.difficulty)}`}>
              {selectedExercise.difficulty}
            </span>

            <p className="text-gray-600 mb-6">{selectedExercise.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Muscles Targeted</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.muscles_targeted.map((muscle, idx) => (
                  <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-lg">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="font-semibold text-gray-900">
                  {selectedExercise.is_bodyweight ? 'Bodyweight' : 'Equipment Required'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Calories/Min</p>
                <p className="font-semibold text-gray-900">{selectedExercise.calories_per_minute}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
