import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import api from '../../services/api';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
      setError('New password must be between 8 and 16 characters long.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('New password must include at least one uppercase letter.');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError('New password must include at least one special character.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.patch('/auth/update-password', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setSuccess(null);
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Password" subtitle="Security & Account Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="input-label">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="input-label">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            8-16 chars, min 1 uppercase letter (A-Z), min 1 special character.
          </p>
        </div>

        <div>
          <label className="input-label">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
