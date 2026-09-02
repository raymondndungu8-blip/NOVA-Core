import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SignInProps {
  onToggle: () => void;
  onDemo: () => void;
}

const fieldClass =
  'w-full rounded-full border border-white/10 bg-[#211f2c]/95 px-11 py-3.5 text-sm text-white placeholder:text-[#777485] outline-none transition focus:border-[#ff6b16] focus:ring-2 focus:ring-[#ff6b16]/20';

export function SignIn({ onToggle, onDemo }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col justify-end px-7 pb-8 pt-16 sm:min-h-[820px]">
      <div className="mb-7 pl-0">
        <div className="mb-4 h-3 w-3 rounded-full bg-[#ff6b16] shadow-[0_0_18px_rgba(255,107,22,0.75)]" />
        <h1 className="text-[3.8rem] font-black leading-[0.78] tracking-[-0.09em] text-white">NOVA</h1>
        <div className="mt-2 font-light italic leading-none tracking-[-0.06em] text-white/90 text-[3.4rem]">Core</div>
        <p className="mt-3 text-[11px] tracking-wide text-white/80">Your personal AI fitness coach</p>
      </div>

      <div className="rounded-2xl bg-[#1a1924]/90 p-0.5 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-2 rounded-xl bg-[#211f2c] p-0.5 text-sm font-medium">
          <button type="button" className="rounded-xl bg-[#ff6b16] py-3 text-white shadow-lg shadow-orange-950/30">Log In</button>
          <button type="button" onClick={onToggle} className="rounded-xl py-3 text-[#777485] transition hover:text-white">Sign Up</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {error && <div className="rounded-xl border border-red-400/30 bg-red-950/60 px-4 py-3 text-xs text-red-200">{error}</div>}
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-white/80">✉</span>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={fieldClass} placeholder="Username or Email" />
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs">🔒</span>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={fieldClass} placeholder="Password" />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/80">◉</span>
        </div>
        <div className="flex justify-end pr-1">
          <button type="button" className="text-[11px] text-[#ff8a4b] hover:text-[#ffb078]">Forgot password?</button>
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-[#c95c14] py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:bg-[#ff6b16] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Signing in...' : '🛩  Log In'}
        </button>
      </form>

      <div className="my-3 flex items-center gap-3 text-[9px] text-white/35"><span className="h-px flex-1 bg-white/10" />or continue with<span className="h-px flex-1 bg-white/10" /></div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="rounded-full bg-white py-3 text-xs font-semibold text-[#15141c] transition hover:bg-white/90">G&nbsp; Google</button>
        <button type="button" className="rounded-full border border-white/10 bg-[#211f2c] py-3 text-xs font-semibold text-white transition hover:bg-white/10">●&nbsp; Apple</button>
      </div>
      <button type="button" onClick={onDemo} className="mt-3 w-full rounded-full border border-[#ff6b16] bg-[#2b1a18]/80 py-3 text-xs font-semibold text-[#ff9a5f] transition hover:bg-[#ff6b16]/15">✦&nbsp; Try Guest Demo</button>
    </div>
  );
}
