import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNext = false,
  hasPrev = false,
}) => {
  if (totalPages <= 1 && !hasNext && !hasPrev) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        margin: '36px 0',
      }}
    >
      <button
        disabled={!hasPrev && currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn btn-outline btn-sm"
        style={{
          opacity: (!hasPrev && currentPage <= 1) ? 0.4 : 1,
          cursor: (!hasPrev && currentPage <= 1) ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      <span
        style={{
          padding: '6px 14px',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
        }}
      >
        Page {currentPage} {totalPages > 1 ? `of ${totalPages}` : ''}
      </span>

      <button
        disabled={!hasNext && currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn btn-outline btn-sm"
        style={{
          opacity: (!hasNext && currentPage >= totalPages) ? 0.4 : 1,
          cursor: (!hasNext && currentPage >= totalPages) ? 'not-allowed' : 'pointer',
        }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
