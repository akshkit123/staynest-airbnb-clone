import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryNav from '../components/CategoryNav';
import PropertyGrid from '../components/PropertyGrid';
import { propertyService } from '../services/propertyService';
import { Sparkles, Shield, Award, Compass } from 'lucide-react';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async (cat = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (cat && cat !== 'all') {
        params.category = cat;
      }
      const data = await propertyService.getProperties(params);
      setProperties(data.results || data || []);
    } catch (err) {
      console.error('Failed to load properties', err);
      setError('Could not load properties. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(activeCategory);
  }, [activeCategory]);

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Over 1,000+ handpicked sanctuaries</span>
          </div>
          <h1 className="hero-title">
            Find places to stay on your next adventure
          </h1>
          <p className="hero-subtitle">
            Discover extraordinary villas, cozy mountain cabins, and oceanfront penthouses worldwide.
          </p>

          <div className="hero-search-wrapper">
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* Category Icons Carousel */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Featured Properties Section */}
      <main className="container properties-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {activeCategory === 'all'
                ? 'Featured places to stay'
                : `Top picks in ${activeCategory}`}
            </h2>
            <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
              Hand-reviewed by StayNest quality curation team
            </p>
          </div>
          <span className="results-badge">
            {loading ? 'Searching...' : `${properties.length} stays available`}
          </span>
        </div>

        {error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--danger)' }}>
            <p>{error}</p>
            <button
              onClick={() => fetchProperties(activeCategory)}
              className="btn btn-outline btn-sm"
              style={{ marginTop: '12px' }}
            >
              Retry
            </button>
          </div>
        ) : (
          <PropertyGrid
            properties={properties}
            loading={loading}
            onClearFilters={() => setActiveCategory('all')}
          />
        )}
      </main>

      {/* Value Propositions Banner */}
      <section className="value-banner container">
        <div className="value-grid">
          <div className="value-card">
            <div className="value-icon-box">
              <Shield size={24} color="#FF385C" />
            </div>
            <h3>StayCover Guarantee</h3>
            <p>Every booking includes comprehensive protection against host cancellations and listing inaccuracies.</p>
          </div>
          <div className="value-card">
            <div className="value-icon-box">
              <Award size={24} color="#FF385C" />
            </div>
            <h3>Verified Superhosts</h3>
            <p>Experience hospitality from highly rated hosts committed to providing outstanding, unforgettable stays.</p>
          </div>
          <div className="value-card">
            <div className="value-icon-box">
              <Compass size={24} color="#FF385C" />
            </div>
            <h3>Instant Flexibility</h3>
            <p>Filter by free cancellation options and enjoy flexible date rescheduling whenever your travel plans shift.</p>
          </div>
        </div>
      </section>

      <style>{`
        .hero-banner {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80');
          background-size: cover;
          background-position: center;
          padding: 80px 0 100px 0;
          color: #FFFFFF;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.65) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.15;
          max-width: 800px;
          margin-bottom: 16px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .hero-subtitle {
          font-size: 1.2rem;
          max-width: 640px;
          margin-bottom: 40px;
          opacity: 0.95;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
        }
        .hero-search-wrapper {
          width: 100%;
        }
        .properties-section {
          padding-top: 36px;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .section-title {
          font-size: 1.55rem;
          font-weight: 800;
          text-transform: capitalize;
        }
        .results-badge {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-secondary);
          padding: 6px 14px;
          border-radius: var(--radius-full);
        }
        .value-banner {
          margin-top: 70px;
          padding: 40px 0;
          border-top: 1px solid var(--border-light);
        }
        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .value-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .value-icon-box {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .value-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
        }
        .value-card p {
          color: var(--text-muted);
          font-size: 0.92rem;
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .value-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
