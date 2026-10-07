import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { PlusCircle, Upload, ArrowLeft, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'beach',
  'mountains',
  'city',
  'countryside',
  'luxury',
  'pools',
  'amazing views',
  'cabins',
];

const PROPERTY_TYPES = ['Apartment', 'Villa', 'House', 'Cabin', 'Penthouse', 'Loft'];

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'Apartment',
    category: 'beach',
    location: '',
    city: '',
    country: '',
    price_per_night: '',
    cleaning_fee: '0',
    service_fee: '0',
    max_guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  });

  const [amenitiesList, setAmenitiesList] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [imageUrls, setImageUrls] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await propertyService.getAmenities();
        setAmenitiesList(data.results || data || []);
      } catch (err) {
        console.error('Failed to load amenities', err);
      }
    };
    fetchAmenities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const urlsArray = imageUrls
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        cleaning_fee: parseFloat(formData.cleaning_fee || 0),
        service_fee: parseFloat(formData.service_fee || 0),
        max_guests: parseInt(formData.max_guests, 10),
        bedrooms: parseInt(formData.bedrooms, 10),
        beds: parseInt(formData.beds, 10),
        bathrooms: parseFloat(formData.bathrooms),
        amenity_ids: selectedAmenities,
        image_urls: urlsArray.length > 0 ? urlsArray : [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        ],
      };

      const created = await propertyService.createProperty(payload);

      // If user selected file images to upload
      if (imageFiles.length > 0) {
        const formFiles = new FormData();
        Array.from(imageFiles).forEach((file) => {
          formFiles.append('images', file);
        });
        await propertyService.uploadImages(created.id, formFiles);
      }

      navigate('/host/listings');
    } catch (err) {
      console.error('Failed to create listing', err);
      setError(
        err.response?.data?.title?.[0] ||
        err.response?.data?.price_per_night?.[0] ||
        'Failed to publish listing. Please check form inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container add-property-page animate-fade-in">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
        >
          <ArrowLeft size={16} /> Back to Listings
        </button>

        <div className="card" style={{ padding: '36px' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '6px' }}>
            Create New Listing
          </h1>
          <p className="text-muted" style={{ marginBottom: '28px', fontSize: '0.95rem' }}>
            List your space on StayNest and welcome guests from all over the world.
          </p>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title & Description */}
            <div className="form-group">
              <label className="form-label">Property Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Modern Sunset Villa with Infinity Pool"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe what makes your space special, the atmosphere, neighborhood, and amenities..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            {/* Type & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="form-select"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  style={{ textTransform: 'capitalize' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Specs */}
            <div className="form-group">
              <label className="form-label">Street / Location Address</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. 14 Marine Drive, Bandra"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  placeholder="e.g. India"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Pricing */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Price per night (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price_per_night"
                  required
                  placeholder="4500.00"
                  value={formData.price_per_night}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cleaning fee (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="cleaning_fee"
                  value={formData.cleaning_fee}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service fee (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="service_fee"
                  value={formData.service_fee}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Capacity & Rooms */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Max guests</label>
                <input
                  type="number"
                  min="1"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Beds</label>
                <input
                  type="number"
                  min="1"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="form-group" style={{ margin: '20px 0' }}>
              <label className="form-label">Amenities available in your space</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {amenitiesList.map((a) => (
                  <label
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a.id)}
                      onChange={() => handleAmenityToggle(a.id)}
                      style={{ accentColor: '#FF385C' }}
                    />
                    <span>{a.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image URLs Input */}
            <div className="form-group">
              <label className="form-label">Image URLs (one URL per line)</label>
              <textarea
                rows={3}
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                className="form-textarea"
              />
            </div>

            {/* Real File Upload */}
            <div className="form-group">
              <label className="form-label">Or upload images directly</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '24px' }}
            >
              {loading ? 'Publishing listing...' : 'Publish Listing'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .add-property-page {
          padding-top: 32px;
          padding-bottom: 80px;
        }
        @media (max-width: 640px) {
          form > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AddProperty;
