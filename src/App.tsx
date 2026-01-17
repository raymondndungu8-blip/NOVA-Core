import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './pages/Dashboard';
import { WorkoutLibrary } from './pages/WorkoutLibrary';
import { CameraScan } from './pages/CameraScan';
import { Progress } from './pages/Progress';
import { Badges } from './pages/Badges';
import { Nutrition } from './pages/Nutrition';
import { CycleTracking } from './pages/CycleTracking';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';

function AuthScreen() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 flex items-center justify-center p-4">
      {isSignIn ? (
        <SignIn onToggle={() => setIsSignIn(false)} />
      ) : (
        <SignUp onToggle={() => setIsSignIn(true)} />
      )}
    </div>
  );
}

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pb-8">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'workouts' && <WorkoutLibrary />}
        {activeTab === 'scan' && <CameraScan />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'nutrition' && <Nutrition />}
        {activeTab === 'cycle' && <CycleTracking />}
        {activeTab === 'community' && <Community />}
        {activeTab === 'badges' && <Badges />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
