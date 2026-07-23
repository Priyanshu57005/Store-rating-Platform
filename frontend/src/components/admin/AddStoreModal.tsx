import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import api from '../../services/api';
import { User } from '../../types/user.types';
import { AlertCircle, Store } from 'lucide-react';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStoreModal: React.FC<AddStoreModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [storeOwners, setStoreOwners] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch store owners for selection
      api.get('/users?role=STORE_OWNER&limit=100').then((res) => {
        if (res.data.success) {
          setStoreOwners(res.data.users);
        }
      }).catch((err) => console.error('Failed to load store owners:', err));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (address.length > 400) {
      setError('Address cannot exceed 400 characters.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/stores', {
        name,
        email,
        address,
        ownerId: ownerId || null,
      });

      if (res.data.success) {
        setName('');
        setEmail('');
        setAddress('');
        setOwnerId('');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add store.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Store" subtitle="Register Store on Rating Platform">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="input-label">Store Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="e.g. Sharma Electronics & Mobile Superstore"
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div>
          <label className="input-label">Store Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="contact@store.com"
            required
          />
        </div>

        <div>
          <label className="input-label">Store Address ({address.length}/400 chars)</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field min-h-[70px]"
            placeholder="Store location address..."
            required
            maxLength={400}
          />
        </div>

        <div>
          <label className="input-label">Assigned Store Owner (Optional)</label>
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="input-field bg-zinc-900"
          >
            <option value="">-- No Owner Assigned --</option>
            {storeOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            <Store className="w-4 h-4" />
            {isLoading ? 'Adding Store...' : 'Add Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
