import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Store, Lock, Mail, AlertCircle, ArrowRight, Shield, Building2, User as UserIcon, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Account Auto-Fill
  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/25 mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign in to RatingHub
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            Single unified authentication portal for System Admins, Store Owners & Users
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 border border-zinc-800 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field !pl-10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-zinc-800">
            <p className="text-xs text-zinc-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
              >
                Register New Account
              </button>
            </p>
          </div>
        </div>

        {/* Demo Account Quick-Access Shortcuts */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> One-Click Role Test Accounts:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@storerating.com', 'Admin@1234Password')}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-violet-500/10 border border-zinc-800 hover:border-violet-500/30 text-left transition-all group"
            >
              <span className="text-[11px] font-bold text-violet-400 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin
              </span>
              <span className="text-[10px] text-zinc-500 block truncate group-hover:text-zinc-300">Click to fill</span>
            </button>

            <button
              onClick={() => handleQuickLogin('owner.rajesh@sharmatronics.in', 'Owner@1234Password')}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 text-left transition-all group"
            >
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Owner
              </span>
              <span className="text-[10px] text-zinc-500 block truncate group-hover:text-zinc-300">Click to fill</span>
            </button>

            <button
              onClick={() => handleQuickLogin('aarav.singh@example.in', 'User@1234Password')}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/30 text-left transition-all group"
            >
              <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> User
              </span>
              <span className="text-[10px] text-zinc-500 block truncate group-hover:text-zinc-300">Click to fill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
