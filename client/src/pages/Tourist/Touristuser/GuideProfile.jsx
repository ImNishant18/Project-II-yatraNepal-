import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaWhatsapp, FaMapMarkerAlt, FaUser, FaTag, FaCalendar, FaMoneyBill, FaTimes } from "react-icons/fa";
import "./guideProfile.css";
import Header from "../../../components/header/Header";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";

// Star Rating Component
const StarRating = ({ rating, maxRating = 5, size = 16 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="guideprofile-rating">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} className="guideprofile-star guideprofile-star-full" size={size} />
            ))}
            {hasHalfStar && (
                <FaStar key="half" className="guideprofile-star guideprofile-star-half" size={size} />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <FaStar key={`empty-${i}`} className="guideprofile-star guideprofile-star-empty" size={size} />
            ))}
            <span className="guideprofile-rating-text">({rating.toFixed(1)})</span>
        </div>
    );
};

const GuideProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guide, setGuide] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [showContactOptions, setShowContactOptions] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: "",
        groupSize: 1,
        paymentMethod: "cash",
        specialRequests: ""
    });
    const [bookingStatus, setBookingStatus] = useState({ message: "", type: "" });
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/touristguide/${id}`, { credentials: "include" });
                if (res.ok) {
                    const guideData = await res.json();
                    setGuide(guideData);
                }
            } catch (error) {
                console.error("Error fetching guide:", error);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/review/`);
                if (res.ok) {
                    const data = await res.json();
                    let allReviews = Array.isArray(data) ? data : data.data || [];
                    const guideReviews = allReviews.filter(
                        (r) => r.reviewedItem?._id === id && r.reviewedModel === "TouristGuide"
                    );
                    setReviews(guideReviews);
                    if (guideReviews.length > 0) {
                        const total = guideReviews.reduce((sum, r) => sum + r.rating, 0);
                        setAverageRating(total / guideReviews.length);
                    }
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchGuide();
        fetchReviews();
    }, [id]);

    const calculateDaysAndPrice = () => {
        if (!bookingData.startDate || !bookingData.endDate || !guide) return { days: 0, totalPrice: 0 };

        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

        if (days < 1) return { days: 0, totalPrice: 0 };

        const totalPrice = guide.pricePerDay * days * bookingData.groupSize;
        return { days, totalPrice };
    };

    const { days, totalPrice } = calculateDaysAndPrice();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (days < 1) {
            setBookingStatus({ message: "Please select valid dates", type: "error" });
            return;
        }

        if (!user) {
            setBookingStatus({ message: "Please log in to book a guide", type: "error" });
            return;
        }

        setBookingStatus({ message: "Processing...", type: "loading" });

        try {
            const response = await fetch(`${BASE_URL}/api/touristguide/book/${guide._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    userId: user._id,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    groupSize: bookingData.groupSize,
                    paymentMethod: bookingData.paymentMethod,
                    specialRequests: bookingData.specialRequests,
                    totalPrice: totalPrice
                })
            });

            const data = await response.json();

            if (response.ok) {
                setBookingStatus({ message: "Booking successful!", type: "success" });
                setTimeout(() => {
                    setShowBookingModal(false);
                    navigate("/user-dashboard?tab=mybookings");
                }, 2000);
            } else {
                setBookingStatus({ message: data.message || "Booking failed", type: "error" });
            }
        } catch (error) {
            console.error("Booking error:", error);
            setBookingStatus({ message: "An error occurred during booking", type: "error" });
        }
    };

    if (!guide) return <div className="guideprofile-loading">Loading...</div>;

    return (
        <>
            <Navbar />
            <Header />
            <div className="guideprofile">
                <div className="guideprofile-container">
                    <div className="guideprofile-card">
                        <div className="guideprofile-image">
                            {guide.img ? (
                                <img src={guide.img} alt={guide.name} />
                            ) : (
                                <div className="guideprofile-placeholder">
                                    <FaUser />
                                </div>
                            )}
                            <div className={`guideprofile-badge ${guide.isAvailable ? "guideprofile-badge-available" : "guideprofile-badge-unavailable"}`}>
                                {guide.isAvailable ? "Available" : "Unavailable"}
                            </div>
                        </div>

                        <div className="guideprofile-content">
                            <h2>{guide.name}</h2>

                            <div className="guideprofile-rating-section">
                                <StarRating rating={averageRating || 0} />
                                <span className="guideprofile-review-count">({reviews.length} reviews)</span>
                            </div>

                            <div className="guideprofile-details">
                                <div className="guideprofile-detail">
                                    <FaMapMarkerAlt />
                                    <span>{guide.location}</span>
                                </div>
                                <div className="guideprofile-detail">
                                    <span>Contact: {guide.contactNumber}</span>
                                </div>
                                <div className="guideprofile-detail">
                                    <span>Email: {guide.email}</span>
                                </div>
                                <div className="guideprofile-detail">
                                    <FaStar />
                                    <span>{guide.experience} years experience</span>
                                </div>
                                <div className="guideprofile-detail">
                                    <FaTag />
                                    <span>Rs. {guide.pricePerDay}/day</span>
                                </div>
                                <div className="guideprofile-detail">
                                    <FaUser />
                                    <span>Max Group: {guide.maxGroupSize}</span>
                                </div>
                                <div className="guideprofile-detail">
                                    <strong>Languages:</strong> {guide.language}
                                </div>
                            </div>

                            <div className="guideprofile-categories">
                                {guide.category && guide.category.map((c, i) => (
                                    <span key={i} className="guideprofile-category">{c}</span>
                                ))}
                            </div>

                            <div className="guideprofile-actions">
                                <button
                                    className="guideprofile-btn-primary"
                                    onClick={() => setShowBookingModal(true)}
                                    disabled={!guide.isAvailable}
                                >
                                    {guide.isAvailable ? "Book Now" : "Not Available"}
                                </button>

                                <button
                                    className="guideprofile-btn-secondary"
                                    onClick={() => setShowContactOptions(!showContactOptions)}
                                >
                                    Contact Guide
                                </button>

                                {showContactOptions && (
                                    <div className="guideprofile-contact-options">
                                        <button
                                            className="guideprofile-chat-btn"
                                            onClick={() => navigate(`/chat/${guide._id}`)}
                                        >
                                            Chat here
                                        </button>
                                        <button
                                            className="guideprofile-whatsapp-btn"
                                            onClick={() => window.open(`https://wa.me/${guide.contactNumber.replace(/\D/g, '')}`, "_blank")}
                                        >
                                            <FaWhatsapp /> WhatsApp
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="guideprofile-reviews">
                        <h3>Reviews</h3>
                        {averageRating > 0 && (
                            <div className="guideprofile-average-rating">
                                Average Rating: {averageRating.toFixed(1)} <FaStar />
                            </div>
                        )}

                        {reviews.length === 0 ? (
                            <p className="guideprofile-no-reviews">No reviews yet</p>
                        ) : (
                            reviews.map(r => (
                                <div key={r._id} className="guideprofile-review">
                                    <div className="guideprofile-review-header">
                                        <h4>{r.userId?.username || "Anonymous"}</h4>
                                        <div className="guideprofile-review-rating">
                                            {r.rating} <FaStar />
                                        </div>
                                    </div>
                                    <p className="guideprofile-review-comment">{r.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && guide && (
                <div className="guideprofile-modal-overlay">
                    <div className="guideprofile-modal">
                        <div className="guideprofile-modal-header">
                            <h2>Book Guide: {guide.name}</h2>
                            <button className="guideprofile-modal-close" onClick={() => setShowBookingModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="guideprofile-booking-form">
                            <div className="guideprofile-form-row">
                                <div className="guideprofile-form-group">
                                    <label htmlFor="startDate">Start Date</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={bookingData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="guideprofile-form-group">
                                    <label htmlFor="endDate">End Date</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={bookingData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            <div className="guideprofile-form-group">
                                <label htmlFor="groupSize">Group Size (Max: {guide.maxGroupSize})</label>
                                <input
                                    type="number"
                                    id="groupSize"
                                    name="groupSize"
                                    value={bookingData.groupSize}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max={guide.maxGroupSize}
                                />
                            </div>

                            <div className="guideprofile-form-group">
                                <label htmlFor="paymentMethod">Payment Method</label>
                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={bookingData.paymentMethod}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="cash">Cash</option>
                                    <option value="esewa">eSewa</option>
                                    <option value="khalti">Khalti</option>
                                </select>
                            </div>

                            <div className="guideprofile-form-group">
                                <label htmlFor="specialRequests">Special Requests</label>
                                <textarea
                                    id="specialRequests"
                                    name="specialRequests"
                                    value={bookingData.specialRequests}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Any special requirements or preferences..."
                                />
                            </div>

                            <div className="guideprofile-price-summary">
                                <h3>Booking Summary</h3>
                                <div className="guideprofile-price-detail">
                                    <span>Price per day:</span>
                                    <span>Rs. {guide.pricePerDay}</span>
                                </div>
                                <div className="guideprofile-price-detail">
                                    <span>Number of days:</span>
                                    <span>{days}</span>
                                </div>
                                <div className="guideprofile-price-detail">
                                    <span>Group size:</span>
                                    <span>{bookingData.groupSize}</span>
                                </div>
                                <div className="guideprofile-price-total">
                                    <span>Total:</span>
                                    <span>Rs. {totalPrice}</span>
                                </div>
                            </div>

                            {bookingStatus.message && (
                                <div className={`guideprofile-booking-status guideprofile-booking-status-${bookingStatus.type}`}>
                                    {bookingStatus.message}
                                </div>
                            )}

                            <div className="guideprofile-modal-footer">
                                <button
                                    type="button"
                                    className="guideprofile-btn-secondary"
                                    onClick={() => setShowBookingModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="guideprofile-btn-primary"
                                    disabled={bookingStatus.type === "loading" || days < 1 || !guide.isAvailable}
                                >
                                    {bookingStatus.type === "loading" ? "Processing..." : "Confirm Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default GuideProfile;