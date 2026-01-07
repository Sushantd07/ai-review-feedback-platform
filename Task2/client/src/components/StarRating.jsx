import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, disabled = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index) => {
        if (!disabled) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleClick = (index) => {
        if (!disabled) {
            onRatingChange(index);
        }
    };

    // Determine which rating to show (hover or selected)
    const displayRating = hoverRating || rating;

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="flex gap-1"
                onMouseLeave={handleMouseLeave}
                role="group"
                aria-label="Star rating"
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`transition-transform duration-150 ${!disabled ? 'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1' : ''
                            }`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        disabled={disabled}
                        aria-label={`Rate ${star} out of 5 stars`}
                    >
                        <Star
                            size={32}
                            className={`transition-colors duration-200 ${star <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-slate-600'
                                }`}
                        />
                    </button>
                ))}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-slate-400 h-5" aria-live="polite">
                {displayRating > 0 ? `${displayRating} / 5` : ''}
            </span>
        </div>
    );
};

export default StarRating;
