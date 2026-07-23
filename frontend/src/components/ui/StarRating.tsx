import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
  showLabel = true,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = activeRating >= star;
          const isHalf = !isFilled && activeRating >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onRatingChange && onRatingChange(star)}
              onMouseEnter={() => !readOnly && setHoverRating(star)}
              onMouseLeave={() => !readOnly && setHoverRating(null)}
              className={`p-0.5 rounded transition-transform duration-100 ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              }`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-zinc-600 fill-zinc-800/50'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-zinc-300 ml-1">
          {rating > 0 ? rating.toFixed(1) : 'No ratings'}
        </span>
      )}
    </div>
  );
};
