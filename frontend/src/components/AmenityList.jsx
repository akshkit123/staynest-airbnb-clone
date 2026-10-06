import React from 'react';
import {
  Wifi,
  Wind,
  Utensils,
  Car,
  Waves,
  Flame,
  Laptop,
  Tv,
  Shirt,
  Compass,
  Mountain,
  Sun,
  Dumbbell,
  Coffee,
  Heart,
  Zap,
  Eye,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

const iconMap = {
  Wifi,
  Wind,
  Utensils,
  Car,
  Waves,
  Flame,
  Laptop,
  Tv,
  Shirt,
  Compass,
  Mountain,
  Sun,
  Dumbbell,
  Coffee,
  Heart,
  Zap,
  Eye,
  ShieldCheck,
  CheckCircle,
};

const AmenityList = ({ amenities = [], columns = 2 }) => {
  if (!amenities || amenities.length === 0) {
    return <p className="text-muted">No specific amenities listed.</p>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: '16px 24px',
        margin: '16px 0',
      }}
    >
      {amenities.map((item) => {
        const IconComponent = iconMap[item.icon] || CheckCircle;
        return (
          <div
            key={item.id || item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.95rem',
              color: 'var(--text-main)',
            }}
          >
            <span style={{ color: '#484848' }}>
              <IconComponent size={20} />
            </span>
            <span>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AmenityList;
