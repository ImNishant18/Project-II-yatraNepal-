import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import {
  ArrowLeft,
  ArrowRight,
  X,
  MapPin,
  Star,
  Calendar,
  Users,
  Plane,
  Check,
  Bed,
  Wifi,
  Coffee,
  Dumbbell,
  ParkingCircle,
  Utensils
} from "lucide-react";

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

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error } = useFetch(`${BASE_URL}/api/hotels/${id}`);
  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch reviews for this hotel
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      setReviewsLoading(true);
      try {
        // Get all reviews and filter for this hotel
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
          
          // Filter reviews for this specific hotel
          const hotelReviews = allReviews.filter(review => 
            review.reviewedItem && 
            review.reviewedItem._id === id && 
            review.reviewedModel === "Hotel"
          );
          
          setReviews(hotelReviews);
          
          // Calculate average rating
          if (hotelReviews.length > 0) {
            const totalRating = hotelReviews.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating(totalRating / hotelReviews.length);
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

    if (data) {
      fetchReviews();
    }
  }, [id, data]);

  const calculateNights = () => {
    if (!dates?.[0]) return 1;
    const start = new Date(dates[0].startDate);
    const end = new Date(dates[0].endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();

  const calculateTotalPrice = () => {
    if (!data) return null;
    const pricePerNight = data.cheapestPrice ? Number(data.cheapestPrice) : 0;
    if (!dates || !options) return pricePerNight;
    const numberOfRooms = Number(options.room) || 1;
    return pricePerNight * numberOfRooms * nights;
  };

  const totalPrice = calculateTotalPrice();

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? (data?.photos?.length || 1) - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === (data?.photos?.length || 1) - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="hotel-page">
      <Navbar />
      <Header type="list" />
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading hotel details...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <X size={48} className="error-icon" />
          <p>Something went wrong loading this hotel!</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      ) : !data ? (
        <p>No hotel data available.</p>
      ) : (
        <div className="hotel-container">
          {open && data.photos && (
            <div className="image-slider">
              <X size={32} className="close-button" onClick={() => setOpen(false)} />
              <div className="nav-button left" onClick={() => handleMove("l")}>
                <ArrowLeft size={32} />
              </div>
              <div className="slider-content">
                <img
                  src={data.photos[slideNumber]}
                  alt={data.name}
                  className="slider-image"
                />
              </div>
              <div className="nav-button right" onClick={() => handleMove("r")}>
                <ArrowRight size={32} />
              </div>
            </div>
          )}
          <div className="hotel-content">
            <div className="hotel-header">
              <div className="title-section">
                <h1 className="hotel-title">{data.name}</h1>
                <div className="rating-section">
                  {averageRating !== null ? (
                    <div className="rating-badge">
                      <StarRating rating={averageRating} size={16} />
                      <span className="review-count">
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : (
                    <div className="rating-badge">
                      <span className="no-rating">N/A</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="location-section">
                <MapPin size={18} />
                <span>{data.address}</span>
              </div>
              <div className="highlight-badges">
                <div className="highlight-badge">
                  <Plane size={14} />
                  <span>Free airport taxi</span>
                </div>
                <div className="highlight-badge">
                  <Check size={14} />
                  <span>Free cancellation</span>
                </div>
              </div>
            </div>
            <div className="hotel-gallery">
              {data.photos?.map((photo, i) => (
                <div className="gallery-item" key={i} onClick={() => handleOpen(i)}>
                  <img
                    src={photo}
                    alt={`${data.name} view ${i + 1}`}
                    className="gallery-image"
                  />
                </div>
              ))}
            </div>
            <div className="hotel-details-grid">
              <div className="description-section">
                <h2 className="section-title">{data.title}</h2>
                <p className="hotel-description">{data.desc}</p>
                
                {/* Reviews Section */}
                <div className="reviews-section">
                  <h3 className="section-title">Guest Reviews</h3>
                  {reviewsLoading ? (
                    <div className="reviews-loading">Loading reviews...</div>
                  ) : reviews.length > 0 ? (
                    <div className="reviews-list">
                      {reviews.slice(0, 3).map((review) => (
                        <div key={review._id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="reviewer-avatar">
                                {review.userId?.username?.charAt(0)?.toUpperCase() || 'G'}
                              </div>
                              <div className="reviewer-details">
                                <span className="reviewer-name">{review.userId?.username || 'Guest'}</span>
                                <StarRating rating={review.rating} size={14} />
                              </div>
                            </div>
                            <span className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="review-comment">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this hotel!</p>
                    </div>
                  )}
                </div>
                
                <div className="amenities-section">
                  <h3 className="amenities-title">Amenities</h3>
                  <div className="amenities-grid">
                    <div className="amenity-item">
                      <Wifi size={18} />
                      <span>Free WiFi</span>
                    </div>
                    <div className="amenity-item">
                      <Bed size={18} />
                      <span>Comfortable beds</span>
                    </div>
                    <div className="amenity-item">
                      <Coffee size={18} />
                      <span>Breakfast included</span>
                    </div>
                    <div className="amenity-item">
                      <ParkingCircle size={18} />
                      <span>Free parking</span>
                    </div>
                    <div className="amenity-item">
                      <Dumbbell size={18} />
                      <span>Fitness center</span>
                    </div>
                    <div className="amenity-item">
                      <Utensils size={18} />
                      <span>Restaurant</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="booking-section">
                <div className="booking-card">
                  <h3 className="price-title">
                    {totalPrice === null ? (
                      "Loading price..."
                    ) : (
                      <>
                        NPR {totalPrice.toLocaleString()}
                        <span className="price-subtitle">
                          {nights > 1 ? ` for ${nights} nights` : " for 1 night"}
                        </span>
                      </>
                    )}
                  </h3>
                  <div className="booking-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <div>
                        <p className="detail-label">Check-in / Check-out</p>
                        <p className="detail-value">
                          {dates?.[0]
                            ? `${new Date(dates[0].startDate).toLocaleDateString()} - ${new Date(dates[0].endDate).toLocaleDateString()}`
                            : "Select dates"}
                        </p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Users size={16} />
                      <div>
                        <p className="detail-label">Guests</p>
                        <p className="detail-value">
                          {options
                            ? `${options.adult || 0} adults, ${options.children || 0} children, ${options.room || 1} room`
                            : "1 room"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="book-now-button" onClick={handleClick}>
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
    </div>
  );
};

export default Hotel;