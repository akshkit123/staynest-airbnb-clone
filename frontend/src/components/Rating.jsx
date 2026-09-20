import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ rating = 4.9, count = null, showEmpty = false, size = 15 }) => {
  const numericRating = Number(rating) || 4.85;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Star size={size} fill="#222222" color="#222222" />
      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
        {numericRating.toFixed(2)}
      </span>
      {count !== null && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default Rating;
