import React, { useState } from 'react';
import { Command, Sparkles, User, Mail, ArrowRight, ShieldCheck, Database, KeyRound } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string, email: string) => void;
  defaultName?: string;
  defaultEmail?: string;
}

export default function LoginScreen({ onLogin, defaultName = 'Krish Garg', defaultEmail = 'krish.garg2708@gmail.com' }: LoginScreenProps) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full administrative name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid corporate email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate database secure sync and onboarding launch sequence
    setTimeout(() => {
      setIsLoading(false);
      onLogin(name.trim(), email.trim());
    }, 1100);
  };

  return (
    <div id="login-screen-root" className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white p-4">
      {/* Decorative ambient elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      
      {/* Visual Tech Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl relative z-10 space-y-6 transition-all duration-300">
        
        {/* Branding Logo & Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 mb-2">
            <Command className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 font-mono font-black py-0.5 px-2.5 rounded-full border border-blue-500/20">
                ADMIN CONSOLE
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-black py-0.5 px-2.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                SECURE
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">NovaFlow Workspace Setup</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Configure your primary administrative account. All CRM dispatchers, logs, and printable audit reports will tailor to your credentials.
            </p>
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-450 rounded-xl text-xs text-center font-semibold">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[9px] text-slate-500 font-mono font-medium">persisted as director</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                id="login-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Krish Garg"
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 pl-11 text-white text-xs placeholder-slate-600 focus:ring-2 focus:ring-blue-500/45 focus:border-blue-500 outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center justify-between">
              <span>Administrative Email</span>
              <span className="text-[9px] text-slate-500 font-mono font-medium">reporting delivery</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. krish.garg2708@gmail.com"
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 pl-11 text-white text-xs placeholder-slate-600 focus:ring-2 focus:ring-blue-500/45 focus:border-blue-500 outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Secure Lock Indicator */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-start gap-2.5 text-[10.5px] text-slate-400 leading-normal">
            <ShieldCheck className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
            <p>
              Local sandbox encryption is active. Your private operational details remain inside this secure browser storage context.
            </p>
          </div>

          {/* Onbound Launch Action Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/60 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLoading ? 'scale-[0.98] brightness-90 animate-pulse' : 'hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 font-semibold">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Synchronizing Databases...</span>
              </span>
            ) : (
              <>
                <span>Mount Admin Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer Technical Metadata */}
        <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-800/60 pt-4 font-mono select-none">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>LOCAL MEMORY POOL</span>
          </span>
          <span className="flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
            <span>SESSION KEY VERIFIED</span>
          </span>
        </div>

      </div>
    </div>
  );
}
