import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { StarRating } from '../ui/StarRating';
import api from '../../services/api';
import { AlertCircle, Star, MessageSquare } from 'lucide-react';

interface RateStoreModalProps {
  storeId: string | null;
  storeName: string | null;
  currentRating?: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RateStoreModal: React.FC<RateStoreModalProps> = ({
  storeId,
  storeName,
  currentRating = 0,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [ratingValue, setRatingValue] = useState<number>(currentRating || 5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRatingValue(currentRating || 5);
      setComment('');
      setError(null);
    }
  }, [isOpen, currentRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setError(null);

    if (ratingValue < 1 || ratingValue > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/ratings', {
        storeId,
        value: ratingValue,
        comment: comment.trim() || undefined,
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentRating ? `Modify Rating for ${storeName}` : `Rate ${storeName}`}
      subtitle="Select a score between 1 and 5 stars"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Rating Star Selection Box */}
        <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center justify-center gap-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400">Your Rating</span>
          <StarRating
            rating={ratingValue}
            onRatingChange={(val) => setRatingValue(val)}
            size="lg"
            showLabel={false}
          />
          <span className="text-sm font-bold text-amber-400 font-mono">
            {ratingValue} / 5 Stars
          </span>
        </div>

        {/* Review Comment (Optional) */}
        <div>
          <label className="input-label flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> Feedback Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details of your experience with this store..."
            className="input-field min-h-[90px]"
            maxLength={500}
          />
          <p className="text-[11px] text-zinc-500 mt-1">{comment.length}/500 chars</p>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            <Star className="w-4 h-4 fill-white" />
            {isLoading ? 'Submitting...' : currentRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
