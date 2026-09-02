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
    <div className="min-h-screen bg-[#07070b] flex items-center justify-center sm:p-6">
      <div
        className="relative min-h-screen w-full max-w-[430px] overflow-hidden bg-[#111019] text-white shadow-2xl sm:min-h-[820px] sm:rounded-[28px] sm:border sm:border-white/10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,8,12,0.08) 0%, rgba(8,8,12,0.35) 30%, #111019 60%, #111019 100%), url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#111019]" />
        <div className="relative z-10 min-h-screen sm:min-h-[820px]">
          {isSignIn ? (
            <SignIn onToggle={() => setIsSignIn(false)} />
          ) : (
            <SignUp onToggle={() => setIsSignIn(true)} />
          )}
        </div>
      </div>
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
