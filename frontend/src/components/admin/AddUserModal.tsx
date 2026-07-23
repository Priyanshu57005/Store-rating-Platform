import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import api from '../../services/api';
import { Role } from '../../types/user.types';
import { AlertCircle, UserPlus } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end validation matching PDF requirements
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
      const res = await api.post('/users', {
        name,
        email,
        password,
        address,
        role,
      });

      if (res.data.success) {
        setName('');
        setEmail('');
        setPassword('');
        setAddress('');
        setRole('USER');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(err.response?.data?.message || 'Failed to create user.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" subtitle="Create System User or Store Owner">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="input-label">Full Name ({name.length}/60 chars - min 20)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="e.g. Aarav Vikramaditya Singh Thakur"
            required
            minLength={20}
            maxLength={60}
          />
        </div>

        <div>
          <label className="input-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label className="input-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            8-16 chars, min 1 uppercase, min 1 special char.
          </p>
        </div>

        <div>
          <label className="input-label">Address ({address.length}/400 chars)</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field min-h-[70px]"
            placeholder="Complete street address, city, state, zip code..."
            required
            maxLength={400}
          />
        </div>

        <div>
          <label className="input-label">User Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="input-field bg-zinc-900"
          >
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            <UserPlus className="w-4 h-4" />
            {isLoading ? 'Creating User...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
