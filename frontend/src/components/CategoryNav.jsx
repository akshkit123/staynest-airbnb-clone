import React from 'react';
import {
  Sun,
  Mountain,
  Building2,
  Trees,
  Sparkles,
  Waves,
  Eye,
  Home,
  Compass,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: Compass },
  { id: 'beach', label: 'Beach', icon: Sun },
  { id: 'mountains', label: 'Mountains', icon: Mountain },
  { id: 'city', label: 'City', icon: Building2 },
  { id: 'countryside', label: 'Countryside', icon: Trees },
  { id: 'luxury', label: 'Luxury', icon: Sparkles },
  { id: 'pools', label: 'Pools', icon: Waves },
  { id: 'amazing views', label: 'Amazing views', icon: Eye },
  { id: 'cabins', label: 'Cabins', icon: Home },
];

const CategoryNav = ({ activeCategory = 'all', onSelectCategory }) => {
  return (
    <div className="category-nav-wrapper">
      <div className="category-nav-scroll container">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive =
            activeCategory?.toLowerCase() === cat.id.toLowerCase() ||
            (!activeCategory && cat.id === 'all');

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`category-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.2 : 1.7} />
              <span className="category-label">{cat.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .category-nav-wrapper {
          border-bottom: 1px solid var(--border-light);
          background: #FFFFFF;
          position: sticky;
          top: var(--nav-height);
          z-index: 10;
        }
        .category-nav-scroll {
          display: flex;
          align-items: center;
          gap: 32px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-top: 14px;
          padding-bottom: 14px;
        }
        .category-nav-scroll::-webkit-scrollbar {
          display: none;
        }
        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          background: transparent;
          border: none;
          padding-bottom: 8px;
          position: relative;
          white-space: nowrap;
          transition: var(--transition);
        }
        .category-item:hover {
          color: var(--text-main);
        }
        .category-item.active {
          color: var(--text-main);
          font-weight: 700;
        }
        .category-item.active::after {
          content: '';
          position: absolute;
          bottom: -14px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--text-main);
        }
        .category-label {
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .category-nav-scroll {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryNav;
