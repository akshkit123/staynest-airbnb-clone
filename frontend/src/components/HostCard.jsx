import React from 'react';
import { Award, ShieldCheck, Mail, Phone } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const HostCard = ({ host }) => {
  if (!host) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '24px 0',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img
          src={host.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
          alt={host.full_name}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #FFFFFF',
            boxShadow: 'var(--shadow-md)',
          }}
        />
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Hosted by {host.full_name}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Joined StayNest {host.created_at ? formatDate(host.created_at) : 'Community'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#4B5563' }}>
          <ShieldCheck size={18} color="#008A05" />
          <span>Identity Verified</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#4B5563' }}>
          <Award size={18} color="#FF385C" />
          <span>Superhost</span>
        </div>
      </div>
    </div>
  );
};

export default HostCard;
