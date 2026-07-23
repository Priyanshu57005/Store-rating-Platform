import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, LogOut, Lock, User as UserIcon, Shield, Building2, Sparkles } from 'lucide-react';
import { UpdatePasswordModal } from './UpdatePasswordModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <Shield className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Building2 className="w-3.5 h-3.5" /> Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <UserIcon className="w-3.5 h-3.5" /> Normal User
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                RatingHub <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </span>
              <span className="text-[10px] text-zinc-400 block -mt-1 uppercase tracking-widest font-mono">
                Store Rating Platform
              </span>
            </div>
          </div>

          {/* User Controls */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-zinc-800">
                <div className="text-right">
                  <p className="text-xs font-medium text-white max-w-[180px] truncate">{user.name}</p>
                  <p className="text-[11px] text-zinc-400">{user.email}</p>
                </div>
                {getRoleBadge(user.role)}
              </div>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Update Password"
              >
                <Lock className="w-4 h-4 text-zinc-400" />
                <span className="hidden md:inline">Password</span>
              </button>

              <button
                onClick={logout}
                className="btn-secondary py-1.5 px-3 text-xs text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Update Password Modal */}
      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
