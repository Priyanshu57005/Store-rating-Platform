import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Store, User, Mail, Lock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'STORE_OWNER' | 'ADMIN'>('USER');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end validations
    if (name.length < 20 || name.length > 60) {
      setError('Name must be between 20 and 60 characters long.');
      return;
    }

    if (address.length > 400) {
      setError('Address cannot exceed 400 characters.');
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError('Password must be between 8 and 16 characters long.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must include at least one uppercase letter.');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must include at least one special character.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', {
        name,
        email,
        address,
        password,
        role,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
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
            Create Platform Account
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            Register as Normal User, Store Owner, or System Administrator
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border border-zinc-800 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label flex justify-between">
                <span>Full Name</span>
                <span className="text-zinc-500 text-[10px] font-mono">{name.length}/60 (min 20)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field !pl-10"
                  placeholder="e.g. Christopher Alexander Davis Junior"
                  required
                  minLength={20}
                  maxLength={60}
                />
              </div>
            </div>

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
              <p className="text-[11px] text-zinc-500 mt-1">
                8-16 chars, min 1 uppercase, min 1 special char.
              </p>
            </div>

            <div>
              <label className="input-label flex justify-between">
                <span>Address</span>
                <span className="text-zinc-500 text-[10px] font-mono">{address.length}/400</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none z-10" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field !pl-10 min-h-[80px]"
                  placeholder="Residential address details..."
                  required
                  maxLength={400}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Register As Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'STORE_OWNER' | 'ADMIN')}
                className="input-field bg-zinc-900 font-medium"
              >
                <option value="USER">Normal User (Store Reviewer)</option>
                <option value="STORE_OWNER">Store Owner (Store Manager)</option>
                <option value="ADMIN">System Administrator (Full Admin Access)</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? (
                'Creating Account...'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-zinc-800">
            <p className="text-xs text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
