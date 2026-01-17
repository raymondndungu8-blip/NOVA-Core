import { useState, useRef, useEffect } from 'react';
import { Camera, X, Play, Pause, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RecognizedExercise {
  name: string;
  confidence: number;
  formScore: number;
  feedback: string[];
}

export function CameraScan() {
  const { user } = useAuth();
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedExercise, setRecognizedExercise] = useState<RecognizedExercise | null>(null);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      setCameraActive(true);
      simulateExerciseRecognition();
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsRecording(false);
    setRecognizedExercise(null);
  };

  const simulateExerciseRecognition = () => {
    setTimeout(() => {
      const exercises = [
        {
          name: 'Push-Up',
          confidence: 94,
          formScore: 88,
          feedback: ['Keep core engaged', 'Lower chest closer to floor', 'Good elbow position'],
        },
        {
          name: 'Squat',
          confidence: 91,
          formScore: 85,
          feedback: ['Keep chest up', 'Drive through heels', 'Good depth'],
        },
        {
          name: 'Plank',
          confidence: 96,
          formScore: 92,
          feedback: ['Excellent form', 'Keep body straight', 'Engage core'],
        },
      ];

      const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
      setRecognizedExercise(randomExercise);
      setShowPrompt(true);
    }, 2000);
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setShowPrompt(false);
    setIsRecording(true);
    simulateRepCounting();
  };

  const simulateRepCounting = () => {
    const interval = setInterval(() => {
      setReps((prev) => {
        const newReps = prev + 1;
        if (newReps >= 10) {
          clearInterval(interval);
          setSets((s) => s + 1);
          setShowPrompt(true);
          setIsRecording(false);
          return 0;
        }
        return newReps;
      });
    }, 2000);
  };

  const saveWorkout = async () => {
    if (!user || !recognizedExercise) return;

    const { data: exercise } = await supabase
      .from('exercises')
      .select('id, calories_per_minute')
      .eq('name', recognizedExercise.name)
      .maybeSingle();

    if (!exercise) return;

    const duration = 5;
    const calories = Math.round(exercise.calories_per_minute * duration);

    const { data: workout } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        title: `${recognizedExercise.name} Workout`,
        duration_minutes: duration,
        calories_burned: calories,
        workout_type: 'strength',
        ai_recognized: true,
      })
      .select()
      .single();

    if (workout) {
      await supabase.from('workout_exercises').insert({
        workout_id: workout.id,
        exercise_id: exercise.id,
        sets: sets,
        reps: 10,
        form_score: recognizedExercise.formScore,
        ai_feedback: recognizedExercise.feedback.join(', '),
        completed: true,
      });

      await supabase
        .from('user_profiles')
        .update({
          total_workouts: supabase.rpc('increment', { x: 1 }),
          total_minutes_exercised: supabase.rpc('increment', { x: duration }),
          streak_count: supabase.rpc('increment', { x: 1 }),
        })
        .eq('user_id', user.id);
    }

    stopCamera();
    alert('Workout saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Workout Scanner</h1>
        <p className="text-gray-600 mt-1">Let AI recognize and guide your exercises</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative bg-gray-900 aspect-video">
          {!cameraActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="w-24 h-24 text-gray-700 mb-4" />
              <button
                onClick={startCamera}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Start Camera
              </button>
              <p className="text-gray-400 mt-4 text-sm">
                Position yourself in frame to begin exercise recognition
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2">
                    {isRecording && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">Recording</span>
                      </div>
                    )}
                    {!isRecording && recognizedExercise && (
                      <span className="text-white font-medium">Ready</span>
                    )}
                    {!recognizedExercise && (
                      <span className="text-white font-medium">Detecting...</span>
                    )}
                  </div>

                  <button
                    onClick={stopCamera}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {recognizedExercise && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {recognizedExercise.name}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          Confidence: {recognizedExercise.confidence}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-lg font-bold">Form Score</p>
                        <p className="text-3xl font-bold text-teal-400">
                          {recognizedExercise.formScore}%
                        </p>
                      </div>
                    </div>

                    {workoutStarted && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-sm">Reps</p>
                          <p className="text-3xl font-bold text-white">{reps}</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-sm">Sets</p>
                          <p className="text-3xl font-bold text-white">{sets}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {recognizedExercise.feedback.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          {item.includes('Good') || item.includes('Excellent') ? (
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span className="text-white text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    {!workoutStarted && showPrompt && (
                      <button
                        onClick={startWorkout}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        <span>Start Workout</span>
                      </button>
                    )}

                    {workoutStarted && !isRecording && sets > 0 && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setIsRecording(true);
                            setShowPrompt(false);
                            simulateRepCounting();
                          }}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                          Next Set
                        </button>
                        <button
                          onClick={saveWorkout}
                          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                          Finish Workout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-2">How it works</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Position yourself in frame so the camera can see your full body</li>
            <li>Start performing an exercise - AI will automatically recognize it</li>
            <li>Follow the real-time form feedback to improve your technique</li>
            <li>AI counts your reps and tracks your progress automatically</li>
            <li>Complete your sets and save your workout</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
