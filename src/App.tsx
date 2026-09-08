import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Dashboard as DemoDashboard } from './pages/DashboardReference';
import { WorkoutLibrary } from './pages/WorkoutLibrary';
import { CameraScan } from './pages/CameraScan';
import { Progress } from './pages/Progress';
import { Badges } from './pages/Badges';
import { Nutrition } from './pages/Nutrition';
import { CycleTracking } from './pages/CycleTracking';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';

type AuthView = 'landing' | 'signin' | 'signup';

function AuthLanding({
  onGetStarted,
  onDemo,
  onLogin,
}: {
  onGetStarted: () => void;
  onDemo: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center sm:p-6">
      <div className="relative w-full max-w-[430px] overflow-hidden bg-black text-white shadow-2xl sm:rounded-[28px] sm:border sm:border-white/10">
        <div className="relative aspect-[9/16] w-full">
          <img
            src="/assets/nova-core-auth-hero.png"
            alt="NOVA-Core — Stronger Every Step"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={onGetStarted}
            aria-label="Get Started"
            className="absolute left-[16%] top-[74.5%] h-[6.2%] w-[68%] rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#ff6b16]"
          />
          <button
            type="button"
            onClick={onDemo}
            aria-label="Try Demo"
            className="absolute left-[16%] top-[83.7%] h-[5.9%] w-[68%] rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#ff6b16]"
          />
          <button
            type="button"
            onClick={onLogin}
            aria-label="Log in"
            className="absolute left-[28%] top-[89.8%] h-[3.4%] w-[44%] rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#ff6b16]"
          />
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ onDemo }: { onDemo: () => void }) {
  const [view, setView] = useState<AuthView>('landing');

  if (view === 'landing') {
    return (
      <AuthLanding
        onGetStarted={() => setView('signup')}
        onDemo={onDemo}
        onLogin={() => setView('signin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center sm:p-6">
      <div className="relative min-h-screen w-full max-w-[430px] overflow-hidden bg-[#111019] text-white shadow-2xl sm:min-h-[820px] sm:rounded-[28px] sm:border sm:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#32120a] via-[#111019] to-[#111019]" />
        <div className="relative z-10 min-h-screen sm:min-h-[820px]">
          <button
            type="button"
            onClick={() => setView('landing')}
            className="absolute left-6 top-6 z-20 rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 hover:border-[#ff6b16] hover:text-white"
          >
            Back
          </button>
          {view === 'signin' ? (
            <SignIn onToggle={() => setView('signup')} onDemo={onDemo} />
          ) : (
            <SignUp onToggle={() => setView('signin')} />
          )}
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [demoMode, setDemoMode] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ff6b16]" />
      </div>
    );
  }

  if (!user && !demoMode) {
    return <AuthScreen onDemo={() => setDemoMode(true)} />;
  }

  if (demoMode) {
    return <DemoDashboard demo onNavigate={setActiveTab} />;
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
