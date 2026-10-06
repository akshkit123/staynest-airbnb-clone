import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Home,
  ShieldCheck,
  Check,
  Send,
} from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import BookingCard from '../components/BookingCard';
import HostCard from '../components/HostCard';
import AmenityList from '../components/AmenityList';
import ReviewCard from '../components/ReviewCard';
import Calendar from '../components/Calendar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { propertyService } from '../services/propertyService';
import { reviewService } from '../services/reviewService';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isFavorited, toggleWishlist } = useWishlist();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review submission form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [propData, reviewsData, availData] = await Promise.all([
        propertyService.getProperty(id),
        reviewService.getPropertyReviews(id).catch(() => []),
        propertyService.getAvailability(id).catch(() => ({ booked_dates: [] })),
      ]);
      setProperty(propData);
      setReviews(reviewsData.results || reviewsData || []);
      setBookedDates(availData.booked_dates || []);
    } catch (err) {
      console.error('Failed to load property details', err);
      setError('Property not found or server is unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleHeartClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (property) {
      await toggleWishlist(property);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      const created = await reviewService.addReview(id, {
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviews([created, ...reviews]);
      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to post review', err);
      alert(err.response?.data?.comment?.[0] || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error || !property) return <ErrorMessage message={error} onRetry={fetchPropertyData} />;

  const favorited = isFavorited(property.id);

  return (
    <div className="container property-details-page animate-fade-in">
      {/* Title & Action Bar */}
      <div className="details-header">
        <h1 className="details-title">{property.title}</h1>
        <div className="details-actions-bar">
          <div className="details-meta-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <Star size={16} fill="#222222" color="#222222" />
              <span>{(Number(property.average_rating) || 4.85).toFixed(2)}</span>
              <span className="text-muted" style={{ fontWeight: 500 }}>
                · {reviews.length || property.review_count} reviews
              </span>
            </div>
            <span>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}>
              <MapPin size={16} />
              <span>{property.location}, {property.city}, {property.country}</span>
            </div>
          </div>

          <div className="details-meta-right">
            <button onClick={handleShare} className="meta-btn">
              <Share2 size={16} /> <span>Share</span>
            </button>
            <button onClick={handleHeartClick} className="meta-btn">
              <Heart
                size={16}
                fill={favorited ? '#FF385C' : 'none'}
                color={favorited ? '#FF385C' : 'var(--text-main)'}
              />
              <span>{favorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <ImageGallery
        images={property.images?.length > 0 ? property.images : [property.primary_image]}
        title={property.title}
      />

      {/* Main Content & Sticky Booking Card Split */}
      <div className="details-layout-grid">
        {/* Left Column: Details */}
        <div className="details-left">
          {/* Room Specs Row */}
          <div className="room-specs-row">
            <div className="spec-item">
              <Users size={18} />
              <span>{property.max_guests} guests</span>
            </div>
            <div className="spec-item">
              <Bed size={18} />
              <span>{property.bedrooms} bedrooms · {property.beds} beds</span>
            </div>
            <div className="spec-item">
              <Bath size={18} />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="spec-item">
              <Home size={18} />
              <span>{property.property_type}</span>
            </div>
          </div>

          {/* Host Card */}
          <HostCard host={property.host} />

          {/* Description */}
          <div className="details-section">
            <h3 className="section-heading">About this space</h3>
            <p className="description-text">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="details-section">
            <h3 className="section-heading">What this place offers</h3>
            <AmenityList amenities={property.amenities} columns={2} />
          </div>

          {/* House Rules */}
          <div className="details-section">
            <h3 className="section-heading">Things to know</h3>
            <div className="rules-grid">
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>House rules</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Check-in after 3:00 PM</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Checkout before 11:00 AM</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No smoking inside</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Safety & property</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Smoke alarm installed</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Carbon monoxide alarm</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>First aid kit available</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Cancellation policy</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full refund within 48 hours of booking.</p>
              </div>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="details-section">
            <h3 className="section-heading">Availability</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
              Booked dates are crossed out below.
            </p>
            <Calendar bookedRanges={bookedDates} onSelectDate={() => {}} />
          </div>

          {/* Reviews Section */}
          <div className="details-section" id="reviews">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Star size={22} fill="#222222" color="#222222" />
              <h3 className="section-heading" style={{ margin: 0 }}>
                {(Number(property.average_rating) || 4.85).toFixed(2)} · {reviews.length} reviews
              </h3>
            </div>

            {/* Post Review Form for Authenticated Guests */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="review-form card">
                <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '12px' }}>
                  Leave a review for this stay
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{ padding: '2px' }}
                    >
                      <Star
                        size={22}
                        fill={star <= newRating ? '#FF385C' : 'none'}
                        color={star <= newRating ? '#FF385C' : '#9CA3AF'}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    {newRating} of 5 stars
                  </span>
                </div>

                <div className="form-group">
                  <textarea
                    rows={3}
                    placeholder="Share your experience with the host, cleanliness, location..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="form-textarea"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview || !newComment.trim()}
                  className="btn btn-primary btn-sm"
                >
                  <Send size={15} /> {submittingReview ? 'Posting...' : 'Post Review'}
                </button>

                {reviewSuccess && (
                  <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '8px' }}>
                    ✓ Thank you! Your review has been posted.
                  </p>
                )}
              </form>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                <a href="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>Log in</a> to write a review.
              </p>
            )}

            {/* Reviews Grid */}
            <div className="reviews-grid">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="details-right">
          <BookingCard property={property} bookedRanges={bookedDates} />
        </div>
      </div>

      <style>{`
        .property-details-page {
          padding-top: 28px;
          padding-bottom: 80px;
        }
        .details-header {
          margin-bottom: 20px;
        }
        .details-title {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 12px;
        }
        .details-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.92rem;
        }
        .details-meta-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .details-meta-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .meta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-main);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .meta-btn:hover {
          background-color: var(--bg-secondary);
        }
        .details-layout-grid {
          display: grid;
          grid-template-columns: 1fr 390px;
          gap: 64px;
          align-items: start;
        }
        .room-specs-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 24px;
          font-size: 0.95rem;
          color: var(--text-main);
        }
        .spec-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .details-section {
          padding: 32px 0;
          border-bottom: 1px solid var(--border-light);
        }
        .section-heading {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .description-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #374151;
          white-space: pre-line;
        }
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .reviews-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 24px;
        }
        .review-form {
          margin-bottom: 24px;
          background: #FAFAFA;
        }
        @media (max-width: 1024px) {
          .details-layout-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .details-right {
            order: -1;
          }
        }
        @media (max-width: 768px) {
          .details-title {
            font-size: 1.5rem;
          }
          .rules-grid, .reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
