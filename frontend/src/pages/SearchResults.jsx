import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import FilterModal from '../components/FilterModal';
import PropertyGrid from '../components/PropertyGrid';
import Pagination from '../components/Pagination';
import { propertyService } from '../services/propertyService';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Extract filter parameters from URL
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const guests = searchParams.get('guests') || '';
  const propertyType = searchParams.get('property_type') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const amenities = searchParams.get('amenities') || '';
  const sort = searchParams.get('sort') || '-created_at';

  const filterState = {
    location,
    min_price: minPrice,
    max_price: maxPrice,
    guests,
    property_type: propertyType,
    bedrooms,
    bathrooms,
    amenities,
    sort,
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
      };
      if (location) params.location = location;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (guests) params.guests = guests;
      if (propertyType) params.property_type = propertyType;
      if (bedrooms) params.bedrooms = bedrooms;
      if (bathrooms) params.bathrooms = bathrooms;
      if (amenities) params.amenities = amenities;
      if (sort) params.sort = sort;

      const data = await propertyService.getProperties(params);
      const items = data.results || data || [];
      setProperties(items);
      setTotalCount(data.count || items.length);
    } catch (err) {
      console.error('Failed to load search results', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams, currentPage]);

  const handleFilterChange = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setCurrentPage(1);
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    const nextParams = new URLSearchParams();
    if (location) nextParams.set('location', location);
    setSearchParams(nextParams);
    setCurrentPage(1);
  };

  return (
    <div className="container search-results-page animate-fade-in">
      {/* Top Header & Sort Bar */}
      <div className="search-header-bar">
        <div>
          <h1 className="search-title">
            {location ? `Stays in ${location}` : 'All Stays'}
          </h1>
          <p className="text-muted" style={{ fontSize: '0.92rem', marginTop: '4px' }}>
            {loading ? 'Finding available stays...' : `${totalCount} places available to book`}
          </p>
        </div>

        <div className="search-actions-bar">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="btn btn-outline btn-sm mobile-filter-btn"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="sort-selector">
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="sort-dropdown"
            >
              <option value="-created_at">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="search-layout">
        {/* Left Column: Filter Sidebar on Desktop */}
        <div className="search-sidebar-desktop">
          <FilterSidebar
            filters={filterState}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Column: Properties Results Grid */}
        <div className="search-main">
          <PropertyGrid
            properties={properties}
            loading={loading}
            onClearFilters={handleResetFilters}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / 12) || 1}
            onPageChange={setCurrentPage}
            hasNext={currentPage * 12 < totalCount}
            hasPrev={currentPage > 1}
          />
        </div>
      </div>

      {/* Mobile/Tablet Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filterState}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalCount={totalCount}
      />

      <style>{`
        .search-results-page {
          padding-top: 32px;
          padding-bottom: 60px;
        }
        .search-header-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .search-title {
          font-size: 1.85rem;
          font-weight: 800;
        }
        .search-actions-bar {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sort-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
          background: #FFFFFF;
        }
        .sort-dropdown {
          border: none;
          background: transparent;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
        }
        .search-layout {
          display: grid;
          grid-template-columns: 290px 1fr;
          gap: 40px;
          align-items: start;
        }
        .mobile-filter-btn {
          display: none;
        }
        @media (max-width: 980px) {
          .search-layout {
            grid-template-columns: 1fr;
          }
          .search-sidebar-desktop {
            display: none;
          }
          .mobile-filter-btn {
            display: inline-flex;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
