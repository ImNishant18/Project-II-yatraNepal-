import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Clock,
    Calendar,
    Info,
    Heart,
    Navigation,
    Landmark,
    Palette,
    Castle,
    Star
} from 'lucide-react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './placedetails.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";

// Star Rating Component
const StarRating = ({ rating, size = 16, showEmpty = false }) => {
  if (rating === null || rating === undefined) return null;
  
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < Math.floor(rating) ? "currentColor" : "none"}
          color={index < Math.floor(rating) ? "#FFD700" : "#ccc"}
        />
      ))}
      <span className="rating-text">({rating.toFixed(1)})</span>
    </div>
  );
};

// Review Component
const ReviewItem = ({ review }) => {
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.userId?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="reviewer-details">
            <span className="reviewer-name">{review.userId?.username || 'Anonymous'}</span>
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <StarRating rating={review.rating} size={18} />
      </div>
      {review.comment && (
        <p className="review-comment">{review.comment}</p>
      )}
    </div>
  );
};

const PlaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [showAllTips, setShowAllTips] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const cityData = {
        kathmandu: {
            name: "Kathmandu",
            color: "#FF6B6B",
            icon: <Landmark size={20} />
        },
        lalitpur: {
            name: "Lalitpur (Patan)",
            color: "#4ECDC4",
            icon: <Palette size={20} />
        },
        bhaktapur: {
            name: "Bhaktapur",
            color: "#FFD166",
            icon: <Castle size={20} />
        },
    };

    const visitorTips = [
        "Wear comfortable shoes as there may be walking involved",
        "Carry water and sun protection during daytime visits",
        "Respect local customs and traditions",
        "Consider hiring a local guide for better understanding",
        "Check opening hours before visiting",
        "Bring cash as some places may not accept cards",
        "Dress modestly if visiting religious sites"
    ];

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                setLoading(true);
                setError('');
                
                const response = await fetch(`${BASE_URL}/api/place/${id}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.data) {
                    setPlace(data.data);
                    if (data.data.location?.coordinates) {
                        const [lng, lat] = data.data.location.coordinates;
                        setCoordinates({ lat, lng });
                        fetchNearbyPlaces(lat, lng);
                    }
                    // Fetch reviews after place details are loaded
                    fetchReviews();
                } else {
                    throw new Error(data.message || 'Place not found');
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching place details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchNearbyPlaces = async (lat, lng) => {
            try {
                const response = await fetch(
                    `${BASE_URL}/api/place/nearby?lat=${lat}&lng=${lng}&radius=2`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setNearbyPlaces(data.data || []);
                    }
                }
            } catch (err) {
                console.error("Error fetching nearby places:", err);
            }
        };

        const fetchReviews = async () => {
          if (!id) return;
          
          setReviewsLoading(true);
          try {
              // Get all reviews and filter for this place
              const reviewsResponse = await fetch(`${BASE_URL}/api/review/`);
              if (reviewsResponse.ok) {
                  const reviewsData = await reviewsResponse.json();
                  
                  // Handle different response structures
                  let allReviews = [];
                  if (Array.isArray(reviewsData)) {
                      allReviews = reviewsData;
                  } else if (reviewsData.data && Array.isArray(reviewsData.data)) {
                      allReviews = reviewsData.data;
                  }
                  
                  // Filter reviews for this specific place
                  const placeReviews = allReviews.filter(review => 
                      review.reviewedItem && 
                      review.reviewedItem._id === id && 
                      review.reviewedModel === "Place"
                  );
                  
                  setReviews(placeReviews);
                  
                  // Calculate average rating
                  if (placeReviews.length > 0) {
                      const totalRating = placeReviews.reduce((sum, review) => sum + review.rating, 0);
                      setAverageRating(totalRating / placeReviews.length);
                  } else {
                      setAverageRating(null);
                  }
              } else {
                  console.error("Failed to fetch reviews:", reviewsResponse.status);
              }
          } catch (error) {
              console.error("Error fetching review data:", error);
          } finally {
              setReviewsLoading(false);
          }
        };

        fetchPlaceDetails();
    }, [id]);

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        setUserLocation(location);
                        setLocationError('');
                        resolve(location);
                    },
                    (err) => {
                        const errorMsg = `Location access denied: ${err.message}`;
                        setLocationError(errorMsg);
                        reject(errorMsg);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } else {
                const errorMsg = "Geolocation is not supported by your browser";
                setLocationError(errorMsg);
                reject(errorMsg);
            }
        });
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Here you would typically make an API call to save to favorites
    };

    const handleGetDirections = async () => {
        try {
            if (!coordinates.lat || !coordinates.lng) {
                throw new Error("Location data not available for this place");
            }

            const currentLocation = userLocation || await getUserLocation();
            
            const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`;
            window.open(url, "_blank", "noopener,noreferrer");
            
        } catch (err) {
            if (coordinates.lat && coordinates.lng) {
                window.open(
                    `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`,
                    "_blank",
                    "noopener,noreferrer"
                );
            }
            setLocationError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="place-details-loading">
                <Navbar />
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Loading place details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="place-details-error">
                <Navbar />
                <div className="error-container">
                    <Info size={48} />
                    <h3>Error loading place details</h3>
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)} className="back-button">
                        <ArrowLeft size={16} /> Go Back
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (!place) {
        return (
            <div className="place-details-not-found">
                <Navbar />
                <div className="not-found-container">
                    <Info size={48} />
                    <h3>Place not found</h3>
                    <p>The place you're looking for doesn't exist or may have been removed.</p>
                    <button onClick={() => navigate('/places')} className="browse-button">
                        Browse Places
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="place-details-page">
            <Navbar />

            <div className="place-details-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> Back to Places
                </button>

                <div className="place-header">
                    <div className="place-title-section">
                        <h1>{place.name}</h1>
                        <div className="place-meta">
                            <span className="place-category">
                                {place.category}
                            </span>
                            <span
                                className="place-city"
                                style={{ color: cityData[place.city]?.color }}
                            >
                                {cityData[place.city]?.icon}
                                {cityData[place.city]?.name || place.city}
                            </span>
                            {averageRating !== null && (
                              <div className="place-rating">
                                <StarRating rating={averageRating} size={16} />
                                <span className="review-count">
                                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                        </div>
                    </div>

                    <div className="place-actions">
                        <button
                            className={`favorite-button ${isFavorite ? 'active' : ''}`}
                            onClick={toggleFavorite}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                            {isFavorite ? 'Saved' : 'Save'}
                        </button>
                        <button
                            className="directions-button"
                            onClick={handleGetDirections}
                            disabled={!coordinates.lat || !coordinates.lng}
                            aria-label="Get directions"
                        >
                            <Navigation size={20} /> Get Directions
                        </button>
                    </div>
                </div>

                {locationError && (
                    <div className="location-error">
                        <Info size={16} />
                        <p>{locationError}</p>
                    </div>
                )}

                <div className="place-image-container">
                    <img
                        src={place.img || '/placeholder.jpg'}
                        alt={place.name}
                        className="place-main-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.jpg';
                        }}
                        loading="lazy"
                    />
                </div>

                <div className="place-content">
                    <div className="place-description">
                        <h2>About This Place</h2>
                        <p>{place.description}</p>
                    </div>

                    <div className="place-details-grid">
                        <div className="detail-card">
                            <MapPin size={24} />
                            <div>
                                <h3>Address</h3>
                                <p>{place.address || 'Address not specified'}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <Clock size={24} />
                            <div>
                                <h3>Best Time to Visit</h3>
                                <p>{place.bestTime || 'Morning (8AM - 11AM)'}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <Calendar size={24} />
                            <div>
                                <h3>Recommended Duration</h3>
                                <p>{place.duration || '1-2 hours'}</p>
                            </div>
                        </div>

                        {place.entryFee && (
                            <div className="detail-card">
                                <Info size={24} />
                                <div>
                                    <h3>Entry Fee</h3>
                                    <p>{place.entryFee}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                      <h2>Customer Reviews</h2>
                      {reviewsLoading ? (
                        <div className="reviews-loading">Loading reviews...</div>
                      ) : reviews.length > 0 ? (
                        <div className="reviews-list">
                          {reviews.map((review) => (
                            <ReviewItem key={review._id} review={review} />
                          ))}
                        </div>
                      ) : (
                        <div className="no-reviews">
                          <Info size={24} />
                          <p>No reviews yet. Be the first to review this place!</p>
                        </div>
                      )}
                    </div>

                    <div className="place-tips">
                        <h2><Info size={24} /> Visitor Tips</h2>
                        <ul>
                            {visitorTips.slice(0, showAllTips ? visitorTips.length : 4).map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                        {visitorTips.length > 4 && (
                            <button 
                                className="show-more-tips"
                                onClick={() => setShowAllTips(!showAllTips)}
                            >
                                {showAllTips ? 'Show Less' : 'Show More Tips'}
                            </button>
                        )}
                    </div>
                </div>

                {coordinates.lat && coordinates.lng && nearbyPlaces.length > 0 && (
                    <div className="nearby-places">
                        <h2>Nearby Attractions</h2>
                        <div className="nearby-grid">
                            {nearbyPlaces.slice(0, 3).map((nearby) => (
                                <div 
                                    key={nearby._id} 
                                    className="nearby-card"
                                    onClick={() => navigate(`/placedetails/${nearby._id}`)}
                                >
                                    <h3>{nearby.name}</h3>
                                    <p>{nearby.distance?.toFixed(1)} km away</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default PlaceDetails;