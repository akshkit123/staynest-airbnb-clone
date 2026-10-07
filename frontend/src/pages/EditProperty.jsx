import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, AlertCircle, Save } from 'lucide-react';

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

const EditProperty = () => {
  const { id } = useParams();
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
  const [newImageUrls, setNewImageUrls] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prop, amenities] = await Promise.all([
          propertyService.getProperty(id),
          propertyService.getAmenities().catch(() => []),
        ]);

        setFormData({
          title: prop.title,
          description: prop.description,
          property_type: prop.property_type,
          category: prop.category,
          location: prop.location,
          city: prop.city,
          country: prop.country,
          price_per_night: prop.price_per_night,
          cleaning_fee: prop.cleaning_fee,
          service_fee: prop.service_fee,
          max_guests: prop.max_guests,
          bedrooms: prop.bedrooms,
          beds: prop.beds,
          bathrooms: prop.bathrooms,
        });

        setSelectedAmenities((prop.amenities || []).map((a) => a.id));
        setAmenitiesList(amenities.results || amenities || []);
      } catch (err) {
        console.error('Failed to load property for editing', err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((item) => item !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const urlsArray = newImageUrls
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
        image_urls: urlsArray,
      };

      await propertyService.updateProperty(id, payload);
      navigate('/host/listings');
    } catch (err) {
      console.error('Failed to update property', err);
      setError('Failed to update property. Please verify your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading property details..." />;

  return (
    <div className="container edit-property-page animate-fade-in">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/host/listings')}
          className="btn-ghost btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
        >
          <ArrowLeft size={16} /> Back to My Listings
        </button>

        <div className="card" style={{ padding: '36px' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '6px' }}>
            Edit Property Listing
          </h1>
          <p className="text-muted" style={{ marginBottom: '28px', fontSize: '0.95rem' }}>
            Update pricing, amenities, room layout, or photos.
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
            <div className="form-group">
              <label className="form-label">Property Title</label>
              <input
                type="text"
                name="title"
                required
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
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

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

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="location"
                required
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
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Price per night (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price_per_night"
                  required
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

            <div className="form-group" style={{ margin: '20px 0' }}>
              <label className="form-label">Amenities</label>
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

            <div className="form-group">
              <label className="form-label">Add more image URLs (one per line)</label>
              <textarea
                rows={2}
                placeholder="https://..."
                value={newImageUrls}
                onChange={(e) => setNewImageUrls(e.target.value)}
                className="form-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '24px' }}
            >
              <Save size={18} /> {saving ? 'Saving changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .edit-property-page {
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

export default EditProperty;
