import { useEffect, useState } from 'react';
import { Bell, ChevronRight, Flame, Search, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  demo?: boolean;
}

interface Stats {
  streak: number;
  todayCalories: number;
  weekWorkouts: number;
}

export function Dashboard({ onNavigate, demo = false }: DashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ streak: 0, todayCalories: 0, weekWorkouts: 0 });
  const [loading, setLoading] = useState(!demo);

  useEffect(() => {
    if (demo) {
      setStats({ streak: 7, todayCalories: 0, weekWorkouts: 0 });
      setLoading(false);
      return;
    }
    if (!user) return;
    const loadStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const [{ data: profile }, { data: workouts }, { data: nutrition }] = await Promise.all([
        supabase.from('user_profiles').select('streak_count').eq('user_id', user.id).maybeSingle(),
        supabase.from('workouts').select('id').eq('user_id', user.id).gte('date', weekAgo),
        supabase.from('nutrition_logs').select('calories').eq('user_id', user.id).eq('log_date', today),
      ]);
      setStats({
        streak: profile?.streak_count || 0,
        todayCalories: nutrition?.reduce((sum, log) => sum + log.calories, 0) || 0,
        weekWorkouts: workouts?.length || 0,
      });
      setLoading(false);
    };
    loadStats();
  }, [demo, user]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0f0e17] text-[#ff6b16]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff6b16] border-t-transparent" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0e17] px-6 pb-10 pt-8 text-white sm:mx-auto sm:min-h-[820px] sm:max-w-[430px] sm:rounded-[28px] sm:border sm:border-white/10">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs text-white/70">Good evening,</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Apex Athlete!</h1>
        </div>
        <button type="button" aria-label="Profile" onClick={() => onNavigate('profile')} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#ff6b16] text-sm font-semibold text-[#ff6b16] transition hover:bg-[#ff6b16]/15">A</button>
      </header>

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#63d7ff]" />
        <input aria-label="Search exercises" className="w-full rounded-full border border-white/5 bg-[#1b1928] py-3 pl-11 pr-4 text-xs text-white outline-none placeholder:text-[#777485] focus:border-[#ff6b16]" placeholder="Search exercises..." />
      </div>

      <section className="mb-5">
        <div className="mb-2 text-xs font-semibold text-white">Today's Nutrition</div>
        <div className="grid grid-cols-3 gap-2">
          <Metric value="42g" label="Protein" color="text-[#ff6b16]" />
          <Metric value="128g" label="Carbs" color="text-[#00ef9b]" />
          <Metric value="32g" label="Fats" color="text-[#9d72ff]" />
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5 text-[#ff7aa8]" /> Smart Suggestion</div>
        <div className="rounded-2xl border border-[#ff6b16]/30 bg-[#1a1928] p-3 shadow-[0_0_18px_rgba(255,107,22,0.08)]">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-wider text-[#ff6b16]">Featured</div>
          <h2 className="text-sm font-bold">Power Core Circuit</h2>
          <p className="mt-1 text-[10px] text-white/60">Full body · 40 mins · ~320 kcal</p>
          <div className="mt-3 flex gap-2"><span className="rounded-full bg-[#252334] px-2.5 py-1 text-[9px] text-white/70">🔥 High Intensity</span><span className="rounded-full bg-[#252334] px-2.5 py-1 text-[9px] text-white/70">▰ No Equipment</span></div>
          <button type="button" onClick={() => onNavigate('scan')} className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-[#ff6b16] py-2.5 text-xs font-bold text-white transition hover:bg-[#ff812f]">Start <ChevronRight className="h-4 w-4" /></button>
        </div>
      </section>

      <section>
        <div className="mb-2 text-xs font-semibold">Today's Summary</div>
        <div className="rounded-2xl border border-[#ff6b16]/25 bg-[#1a1928] p-3">
          <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
            <Summary value={String(stats.weekWorkouts)} label="Workouts" color="text-[#ff6b16]" />
            <Summary value={String(stats.todayCalories)} label="Total kcal" color="text-[#00ef9b]" />
            <Summary value={`${stats.streak} 🔥`} label="Day Streak" color="text-[#ff6b16]" />
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-white/55"><span>Weekly Goal</span><span className="text-[#ff9a5f]">0%</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2b2938]"><div className="h-full w-[3%] rounded-full bg-[#ff6b16]" /></div>
          <p className="mt-2 text-[9px] text-white/35">0 of 4 workouts this week</p>
        </div>
      </section>

      <nav className="mt-7 flex items-center justify-around rounded-2xl border border-white/5 bg-[#191824] py-3 text-[10px] text-white/45">
        <button type="button" onClick={() => onNavigate('dashboard')} className="text-[#ff6b16]"><Bell className="mx-auto mb-1 h-4 w-4" />Home</button>
        <button type="button" onClick={() => onNavigate('workouts')} className="transition hover:text-white">▣<span className="ml-1">Workouts</span></button>
        <button type="button" onClick={() => onNavigate('progress')} className="transition hover:text-white">◒<span className="ml-1">Progress</span></button>
        <button type="button" onClick={() => onNavigate('profile')} className="transition hover:text-white">●<span className="ml-1">Profile</span></button>
      </nav>
    </div>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: string }) {
  return <div className="rounded-xl border border-white/5 bg-[#1b1928] px-2 py-3 text-center"><div className={`text-base font-bold ${color}`}>{value}</div><div className="mt-1 text-[9px] text-white/45">{label}</div></div>;
}

function Summary({ value, label, color }: { value: string; label: string; color: string }) {
  return <div className="px-2"><div className={`text-lg font-bold ${color}`}>{value}</div><div className="mt-1 text-[9px] text-white/45">{label}</div></div>;
}
