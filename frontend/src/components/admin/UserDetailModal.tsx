import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { StarRating } from '../ui/StarRating';
import api from '../../services/api';
import { User } from '../../types/user.types';
import { User as UserIcon, Mail, MapPin, Shield, Building2, Star, Calendar, Store } from 'lucide-react';

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, isOpen, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      api.get(`/users/${userId}`)
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.user);
          }
        })
        .catch((err) => console.error('Failed to fetch user details:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Account Details" subtitle="Comprehensive user information">
      {isLoading || !user ? (
        <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Loading user profile...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">{user.name}</h4>
              <p className="text-xs text-zinc-400">{user.email}</p>
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Shield className="w-3 h-3" /> {user.role}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
              <Mail className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-zinc-500 uppercase font-semibold text-[10px] tracking-wider block">Email Address</span>
                <span className="text-zinc-200 font-medium">{user.email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-zinc-500 uppercase font-semibold text-[10px] tracking-wider block">Residential / Business Address</span>
                <span className="text-zinc-200 font-medium">{user.address}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-zinc-500 uppercase font-semibold text-[10px] tracking-wider block">Account Created Date</span>
                <span className="text-zinc-200 font-medium">{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
              </div>
            </div>
          </div>

          {/* Store Owner Rating Details (If Role is STORE_OWNER) */}
          {user.role === 'STORE_OWNER' && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-amber-400" /> Store Owner Rating Performance
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {user.ownerRating?.totalRatings || 0} Ratings Total
                </span>
              </div>

              <div className="flex items-center justify-between bg-zinc-900/90 p-3 rounded-lg border border-amber-500/10">
                <span className="text-xs text-zinc-300 font-medium">Overall Store Rating</span>
                <StarRating rating={user.ownerRating?.averageRating || 0} readOnly size="md" />
              </div>

              {user.ownerRating?.stores && user.ownerRating.stores.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Stores Owned</span>
                  <div className="space-y-1.5">
                    {user.ownerRating.stores.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-xs p-2 rounded bg-zinc-950/80 border border-zinc-800">
                        <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-indigo-400" /> {s.name}
                        </span>
                        <StarRating rating={s.avgRating} readOnly size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
              Close Details
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
