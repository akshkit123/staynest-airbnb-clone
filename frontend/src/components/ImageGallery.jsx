import React, { useState } from 'react';
import { Grid, X } from 'lucide-react';
import Modal from './Modal';

const ImageGallery = ({ images = [], title = 'Property Photos' }) => {
  const [showAllModal, setShowAllModal] = useState(false);

  // Normalize images list
  const imageUrls = images.map((img) => img.url || img.image_url || img);
  if (imageUrls.length === 0) {
    imageUrls.push(
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    );
  }

  const primaryImage = imageUrls[0];
  const sideImages = imageUrls.slice(1, 5);

  return (
    <div style={{ position: 'relative', margin: '20px 0 32px 0' }}>
      <div className="gallery-grid">
        {/* Main Large Left Photo */}
        <div className="gallery-main" onClick={() => setShowAllModal(true)}>
          <img src={primaryImage} alt={`${title} main view`} />
        </div>

        {/* 4 Grid Photos on Right */}
        <div className="gallery-side">
          {[0, 1, 2, 3].map((index) => {
            const src = sideImages[index] || primaryImage;
            return (
              <div
                key={index}
                className="gallery-thumb"
                onClick={() => setShowAllModal(true)}
              >
                <img src={src} alt={`${title} detail ${index + 1}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Show all photos button */}
      <button
        onClick={() => setShowAllModal(true)}
        className="show-all-btn"
      >
        <Grid size={16} />
        <span>Show all {imageUrls.length} photos</span>
      </button>

      {/* Full Gallery Modal */}
      <Modal
        isOpen={showAllModal}
        onClose={() => setShowAllModal(false)}
        title={title}
        maxWidth="900px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {imageUrls.map((url, idx) => (
            <div key={idx} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img
                src={url}
                alt={`${title} view ${idx + 1}`}
                style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </Modal>

      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          height: 440px;
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .gallery-main {
          height: 100%;
          cursor: pointer;
          overflow: hidden;
        }
        .gallery-main img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .gallery-main:hover img {
          transform: scale(1.02);
        }
        .gallery-side {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 10px;
          height: 100%;
        }
        .gallery-thumb {
          cursor: pointer;
          overflow: hidden;
          height: 100%;
        }
        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .gallery-thumb:hover img {
          transform: scale(1.03);
        }
        .show-all-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: #FFFFFF;
          color: var(--text-main);
          border: 1px solid var(--border-dark);
          border-radius: var(--radius-sm);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
        }
        .show-all-btn:hover {
          background: var(--bg-secondary);
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            height: 300px;
          }
          .gallery-side {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;
