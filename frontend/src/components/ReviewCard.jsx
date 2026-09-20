import React from 'react';
import { Star } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-light)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={
            review.user?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.email || 'guest'}`
          }
          alt={review.user?.full_name || 'Guest'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {review.user?.full_name || 'Guest'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {formatDate(review.created_at)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < review.rating ? '#222222' : 'none'}
            color="#222222"
          />
        ))}
      </div>

      <p style={{ color: '#374151', fontSize: '0.92rem', lineHeight: 1.55 }}>
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
