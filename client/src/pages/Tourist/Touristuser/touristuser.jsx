import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTimes, FaUser, FaCalendar, FaMoneyBill, FaTag, FaStar } from "react-icons/fa";

import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import "./touristuser.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";

// Star Rating Component
const StarRating = ({ rating, maxRating = 5, size = 16 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="userdashboard-rating">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} className="userdashboard-star userdashboard-star-full" size={size} />
            ))}
            {hasHalfStar && (
                <FaStar key="half" className="userdashboard-star userdashboard-star-half" size={size} />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <FaStar key={`empty-${i}`} className="userdashboard-star userdashboard-star-empty" size={size} />
            ))}
            <span className="userdashboard-rating-text">({rating.toFixed(1)})</span>
        </div>
    );
};

const UserDashboard = () => {
    const [guides, setGuides] = useState([]);
    const [unavailableGuides, setUnavailableGuides] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("guides");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: "",
        groupSize: 1,
        paymentMethod: "cash",
        specialRequests: ""
    });
    const [bookingStatus, setBookingStatus] = useState({ message: "", type: "" });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const calculateDaysAndPrice = () => {
        if (!bookingData.startDate || !bookingData.endDate) return { days: 0, totalPrice: 0 };

        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

        if (days < 1 || !selectedGuide) return { days: 0, totalPrice: 0 };

        const totalPrice = selectedGuide.pricePerDay * days * bookingData.groupSize;
        return { days, totalPrice };
    };

    const { days, totalPrice } = calculateDaysAndPrice();

    // Fetch reviews for a guide
    const fetchGuideReviews = async (guideId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/review/`);
            if (res.ok) {
                const data = await res.json();
                let allReviews = Array.isArray(data) ? data : data.data || [];
                const guideReviews = allReviews.filter(
                    (r) => r.reviewedItem?._id === guideId && r.reviewedModel === "TouristGuide"
                );

                if (guideReviews.length > 0) {
                    const total = guideReviews.reduce((sum, r) => sum + r.rating, 0);
                    return {
                        averageRating: total / guideReviews.length,
                        reviewCount: guideReviews.length
                    };
                }
            }
            return { averageRating: 0, reviewCount: 0 };
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return { averageRating: 0, reviewCount: 0 };
        }
    };

    // Fetch guides + unavailable guides + user bookings
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch available guides
                const resGuides = await fetch(`${BASE_URL}/api/touristguide`, { credentials: "include" });
                if (resGuides.ok) {
                    const guidesData = await resGuides.json();

                    // Fetch reviews for each guide
                    const guidesWithRatings = await Promise.all(
                        guidesData.map(async (guide) => {
                            const { averageRating, reviewCount } = await fetchGuideReviews(guide._id);
                            return {
                                ...guide,
                                rating: averageRating,
                                reviews: reviewCount
                            };
                        })
                    );

                    setGuides(guidesWithRatings);
                }

                // Fetch unavailable guides
                const resUnavailable = await fetch(`${BASE_URL}/api/touristguide/unavailable/all`, {
                    credentials: "include"
                });
                if (resUnavailable.ok) {
                    const unavailableData = await resUnavailable.json();

                    // Fetch reviews for each unavailable guide
                    const unavailableWithRatings = await Promise.all(
                        unavailableData.map(async (guide) => {
                            const { averageRating, reviewCount } = await fetchGuideReviews(guide._id);
                            return {
                                ...guide,
                                rating: averageRating,
                                reviews: reviewCount
                            };
                        })
                    );

                    setUnavailableGuides(unavailableWithRatings);
                }

                // Fetch user bookings
                if (user?._id) {
                    const resBookings = await fetch(`${BASE_URL}/api/touristguide/bookings/user/${user._id}`, {
                        credentials: "include"
                    });
                    if (resBookings.ok) {
                        const bookingsData = await resBookings.json();

                        // Fetch ratings for each guide in bookings
                        const bookingsWithRatings = await Promise.all(
                            bookingsData.map(async (booking) => {
                                if (booking.guideId) {
                                    const { averageRating, reviewCount } = await fetchGuideReviews(booking.guideId._id);
                                    return {
                                        ...booking,
                                        guideId: {
                                            ...booking.guideId,
                                            rating: averageRating,
                                            reviews: reviewCount
                                        }
                                    };
                                }
                                return booking;
                            })
                        );

                        setBookings(bookingsWithRatings);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Book Now
    const handleBookNow = (guide) => {
        setSelectedGuide(guide);
        setShowBookingModal(true);
        setBookingData({
            startDate: "",
            endDate: "",
            groupSize: 1,
            paymentMethod: "cash",
            specialRequests: ""
        });
        setBookingStatus({ message: "", type: "" });
    };

    // Submit Booking
    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (days < 1) {
            setBookingStatus({ message: "Please select valid dates", type: "error" });
            return;
        }

        setBookingStatus({ message: "Processing...", type: "loading" });

        try {
            const response = await fetch(`${BASE_URL}/api/touristguide/book/${selectedGuide._id}`, {
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

                // Refresh data
                const resGuides = await fetch(`${BASE_URL}/api/touristguide`, { credentials: "include" });
                if (resGuides.ok) {
                    const guidesData = await resGuides.json();
                    const guidesWithRatings = await Promise.all(
                        guidesData.map(async (guide) => {
                            const { averageRating, reviewCount } = await fetchGuideReviews(guide._id);
                            return {
                                ...guide,
                                rating: averageRating,
                                reviews: reviewCount
                            };
                        })
                    );
                    setGuides(guidesWithRatings);
                }

                const resUnavailable = await fetch(`${BASE_URL}/api/touristguide/unavailable/all`, {
                    credentials: "include"
                });
                if (resUnavailable.ok) {
                    const unavailableData = await resUnavailable.json();
                    const unavailableWithRatings = await Promise.all(
                        unavailableData.map(async (guide) => {
                            const { averageRating, reviewCount } = await fetchGuideReviews(guide._id);
                            return {
                                ...guide,
                                rating: averageRating,
                                reviews: reviewCount
                            };
                        })
                    );
                    setUnavailableGuides(unavailableWithRatings);
                }

                const resBookings = await fetch(`${BASE_URL}/api/touristguide/bookings/user/${user._id}`, {
                    credentials: "include"
                });
                if (resBookings.ok) {
                    const bookingsData = await resBookings.json();
                    const bookingsWithRatings = await Promise.all(
                        bookingsData.map(async (booking) => {
                            if (booking.guideId) {
                                const { averageRating, reviewCount } = await fetchGuideReviews(booking.guideId._id);
                                return {
                                    ...booking,
                                    guideId: {
                                        ...booking.guideId,
                                        rating: averageRating,
                                        reviews: reviewCount
                                    }
                                };
                            }
                            return booking;
                        })
                    );
                    setBookings(bookingsWithRatings);
                }

                setTimeout(() => {
                    setShowBookingModal(false);
                    setActiveTab("mybookings");
                }, 2000);
            } else {
                setBookingStatus({ message: data.message || "Booking failed", type: "error" });
            }
        } catch (error) {
            console.error("Booking error:", error);
            setBookingStatus({ message: "An error occurred during booking", type: "error" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Cancel Booking
    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const reason = prompt("Please provide a reason for cancellation:");
                if (reason === null) return;

                const response = await fetch(`${BASE_URL}/api/touristguide/cancel/${bookingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ reason })
                });

                if (response.ok) {
                    alert("Booking cancelled successfully!");

                    // Refresh data
                    const resGuides = await fetch(`${BASE_URL}/api/touristguide`, { credentials: "include" });
                    if (resGuides.ok) {
                        const guidesData = await resGuides.json();
                        const guidesWithRatings = await Promise.all(
                            guidesData.map(async (guide) => {
                                const { averageRating, reviewCount } = await fetchGuideReviews(guide._id);
                                return {
                                    ...guide,
                                    rating: averageRating,
                                    reviews: reviewCount
                                };
                            })
                        );
                        setGuides(guidesWithRatings);
                    }

                    const resUnavailable = await fetch(`${BASE_URL}/api/touristguide/unavailable/all`, {
                        credentials: "include"
                    });
                    if (resUnavailable.ok) {
                        const unavailableData = await resUnavailable.json();
                        const unavailableWithRatings = await Promise.all(
                            unavailableData.map(async (guide) => {
                                const { averageRating, reviewCount } = await fetchGuideReviews(guide._id);
                                return {
                                    ...guide,
                                    rating: averageRating,
                                    reviews: reviewCount
                                };
                            })
                        );
                        setUnavailableGuides(unavailableWithRatings);
                    }

                    const resBookings = await fetch(`${BASE_URL}/api/touristguide/bookings/user/${user._id}`, {
                        credentials: "include"
                    });
                    if (resBookings.ok) {
                        const bookingsData = await resBookings.json();
                        const bookingsWithRatings = await Promise.all(
                            bookingsData.map(async (booking) => {
                                if (booking.guideId) {
                                    const { averageRating, reviewCount } = await fetchGuideReviews(booking.guideId._id);
                                    return {
                                        ...booking,
                                        guideId: {
                                            ...booking.guideId,
                                            rating: averageRating,
                                            reviews: reviewCount
                                        }
                                    };
                                }
                                return booking;
                            })
                        );
                        setBookings(bookingsWithRatings);
                    }
                } else {
                    const data = await response.json();
                    alert(data.message || "Failed to cancel booking");
                }
            } catch (error) {
                console.error("Cancellation error:", error);
                alert("An error occurred while cancelling the booking");
            }
        }
    };

    return (
        <>
            <Navbar />
            <Header />
            <div className="userdashboard">
                <div className="userdashboard-hero">
                    <h1>Discover Nepal with Expert Guides</h1>
                    <p>Experience the Himalayas like never before with our certified local guides</p>
                </div>

                <div className="userdashboard-container">
                    {/* Tabs */}
                    <div className="userdashboard-tabs">
                        {["guides", "unavailable", "mybookings"].map((tab) => (
                            <button
                                key={tab}
                                className={`userdashboard-tab ${activeTab === tab ? "userdashboard-tab-active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "guides" && "Available Guides"}
                                {tab === "unavailable" && "Unavailable Guides"}
                                {tab === "mybookings" && "My Bookings"}
                            </button>
                        ))}
                    </div>

                    {/* Available Guides */}
                    {activeTab === "guides" && (
                        <section className="userdashboard-section">
                            {loading ? (
                                <div className="userdashboard-loading">Loading guides...</div>
                            ) : guides.length === 0 ? (
                                <div className="userdashboard-empty">No guides available at the moment.</div>
                            ) : (
                                <div className="userdashboard-grid">
                                    {guides.map((guide) => (
                                        <div className="userdashboard-card" key={guide._id}>
                                            <div className="userdashboard-card-image">
                                                {guide.img ? (
                                                    <img src={guide.img} alt={guide.name} />
                                                ) : (
                                                    <div className="userdashboard-card-placeholder">
                                                        <FaUser />
                                                    </div>
                                                )}
                                                <div className="userdashboard-card-badge">Available</div>
                                            </div>
                                            <div className="userdashboard-card-content">
                                                <h3>{guide.name}</h3>
                                                <div className="userdashboard-card-rating">
                                                    <StarRating rating={guide.rating} />
                                                    <span className="userdashboard-review-count">({guide.reviews} reviews)</span>
                                                </div>
                                                <div className="userdashboard-card-details">
                                                    <div className="userdashboard-card-detail">
                                                        <FaStar />
                                                        <span>{guide.experience} years experience</span>
                                                    </div>
                                                    <div className="userdashboard-card-detail">
                                                        <FaMapMarkerAlt />
                                                        <span>{guide.location}</span>
                                                    </div>
                                                    <div className="userdashboard-card-detail">
                                                        <FaTag />
                                                        <span>Rs. {guide.pricePerDay}/day</span>
                                                    </div>
                                                    <div className="userdashboard-card-detail">
                                                        <FaUser />
                                                        <span>Max Group: {guide.maxGroupSize}</span>
                                                    </div>
                                                </div>
                                                <div className="userdashboard-card-languages">
                                                    <strong>Languages:</strong> {guide.language}
                                                </div>
                                                <div className="userdashboard-card-categories">
                                                    {guide.category && guide.category.map((c, i) => (
                                                        <span key={i} className="userdashboard-category">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="userdashboard-card-footer">
                                                <button
                                                    className="userdashboard-btn-secondary"
                                                    onClick={() => navigate(`/guide/${guide._id}`)}
                                                >
                                                    View Profile
                                                </button>
                                                <button
                                                    className="userdashboard-btn-primary"
                                                    onClick={() => handleBookNow(guide)}
                                                    disabled={!guide.isAvailable}
                                                >
                                                    {guide.isAvailable ? "Book Now" : "Not Available"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Unavailable Guides */}
                    {activeTab === "unavailable" && (
                        <section className="userdashboard-section">
                            <h2 className="userdashboard-section-title">Unavailable Guides</h2>
                            {loading ? (
                                <div className="userdashboard-loading">Loading unavailable guides...</div>
                            ) : unavailableGuides.length === 0 ? (
                                <div className="userdashboard-empty">All guides are currently available.</div>
                            ) : (
                                <div className="userdashboard-grid">
                                    {unavailableGuides.map((guide) => (
                                        <div className="userdashboard-card userdashboard-card-unavailable" key={guide._id}>
                                            <div className="userdashboard-card-image">
                                                {guide.img ? (
                                                    <img src={guide.img} alt={guide.name} />
                                                ) : (
                                                    <div className="userdashboard-card-placeholder">
                                                        <FaUser />
                                                    </div>
                                                )}
                                                <div className="userdashboard-card-badge userdashboard-card-badge-unavailable">Unavailable</div>
                                            </div>
                                            <div className="userdashboard-card-content">
                                                <h3>{guide.name}</h3>
                                                <div className="userdashboard-card-rating">
                                                    <StarRating rating={guide.rating} />
                                                    <span className="userdashboard-review-count">({guide.reviews} reviews)</span>
                                                </div>
                                                <div className="userdashboard-card-details">
                                                    <div className="userdashboard-card-detail">
                                                        <FaStar />
                                                        <span>{guide.experience} years experience</span>
                                                    </div>
                                                    <div className="userdashboard-card-detail">
                                                        <FaMapMarkerAlt />
                                                        <span>{guide.location}</span>
                                                    </div>
                                                    <div className="userdashboard-card-detail">
                                                        <FaTag />
                                                        <span>Rs. {guide.pricePerDay}/day</span>
                                                    </div>
                                                </div>
                                                <div className="userdashboard-card-languages">
                                                    <strong>Languages:</strong> {guide.language}
                                                </div>
                                            </div>
                                            <div className="userdashboard-card-footer">
                                                <button
                                                    className="userdashboard-btn-secondary"
                                                    onClick={() => navigate(`/guide/${guide._id}`)}
                                                >
                                                    View Profile
                                                </button>
                                                <button className="userdashboard-btn-disabled" disabled>
                                                    Not Available
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Booking History */}
                    {activeTab === "mybookings" && (
                        <section className="userdashboard-section">
                            <h2 className="userdashboard-section-title">My Booking History</h2>
                            {loading ? (
                                <div className="userdashboard-loading">Loading bookings...</div>
                            ) : bookings.length === 0 ? (
                                <div className="userdashboard-empty">No bookings found.</div>
                            ) : (
                                <div className="userdashboard-bookings">
                                    {bookings.map((b) => (
                                        <div key={b._id} className="userdashboard-booking">
                                            <div className="userdashboard-booking-image">
                                                {b.guideId?.img ? (
                                                    <img src={b.guideId.img} alt={b.guideId.name} />
                                                ) : (
                                                    <div className="userdashboard-card-placeholder">
                                                        <FaUser />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="userdashboard-booking-content">
                                                <div className="userdashboard-booking-header">
                                                    <h3>{b.guideId?.name}</h3>
                                                    {b.guideId?.rating > 0 && (
                                                        <div className="userdashboard-booking-rating">
                                                            <StarRating rating={b.guideId.rating} size={14} />
                                                            <span className="userdashboard-review-count">({b.guideId.reviews} reviews)</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="userdashboard-booking-details">
                                                    <div className="userdashboard-booking-detail">
                                                        <FaCalendar />
                                                        <span>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="userdashboard-booking-detail">
                                                        <FaUser />
                                                        <span>Group Size: {b.groupSize}</span>
                                                    </div>
                                                    <div className="userdashboard-booking-detail">
                                                        <FaMoneyBill />
                                                        <span>Total: Rs. {b.totalPrice}</span>
                                                    </div>
                                                    <div className="userdashboard-booking-detail">
                                                        <span className={`userdashboard-status userdashboard-status-${b.status}`}>
                                                            {b.status}
                                                        </span>
                                                    </div>
                                                    {b.specialRequests && (
                                                        <div className="userdashboard-booking-detail">
                                                            <strong>Special Requests:</strong> {b.specialRequests}
                                                        </div>
                                                    )}
                                                    {b.cancellationReason && (
                                                        <div className="userdashboard-booking-detail">
                                                            <strong>Cancellation Reason:</strong> {b.cancellationReason}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="userdashboard-booking-actions">
                                                    <button
                                                        className="userdashboard-btn-secondary"
                                                        onClick={() => navigate(`/guide/${b.guideId._id}`)}
                                                    >
                                                        View Guide
                                                    </button>
                                                    {b.status === "confirmed" && (
                                                        <button
                                                            className="userdashboard-btn-warning"
                                                            onClick={() => handleCancelBooking(b._id)}
                                                        >
                                                            Cancel Booking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedGuide && (
                <div className="userdashboard-modal-overlay">
                    <div className="userdashboard-modal">
                        <div className="userdashboard-modal-header">
                            <h2>Book Guide: {selectedGuide.name}</h2>
                            <button className="userdashboard-modal-close" onClick={() => setShowBookingModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="userdashboard-booking-form">
                            <div className="userdashboard-form-row">
                                <div className="userdashboard-form-group">
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

                                <div className="userdashboard-form-group">
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

                            <div className="userdashboard-form-group">
                                <label htmlFor="groupSize">Group Size (Max: {selectedGuide.maxGroupSize})</label>
                                <input
                                    type="number"
                                    id="groupSize"
                                    name="groupSize"
                                    value={bookingData.groupSize}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max={selectedGuide.maxGroupSize}
                                />
                            </div>

                            <div className="userdashboard-form-group">
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

                            <div className="userdashboard-form-group">
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

                            <div className="userdashboard-price-summary">
                                <h3>Booking Summary</h3>
                                <div className="userdashboard-price-detail">
                                    <span>Price per day:</span>
                                    <span>Rs. {selectedGuide.pricePerDay}</span>
                                </div>
                                <div className="userdashboard-price-detail">
                                    <span>Number of days:</span>
                                    <span>{days}</span>
                                </div>
                                <div className="userdashboard-price-detail">
                                    <span>Group size:</span>
                                    <span>{bookingData.groupSize}</span>
                                </div>
                                <div className="userdashboard-price-total">
                                    <span>Total:</span>
                                    <span>Rs. {totalPrice}</span>
                                </div>
                            </div>

                            {bookingStatus.message && (
                                <div className={`userdashboard-booking-status userdashboard-booking-status-${bookingStatus.type}`}>
                                    {bookingStatus.message}
                                </div>
                            )}

                            <div className="userdashboard-modal-footer">
                                <button
                                    type="button"
                                    className="userdashboard-btn-secondary"
                                    onClick={() => setShowBookingModal(false)}
                                    disabled={bookingStatus.type === "loading" || bookingStatus.type === "success"}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="userdashboard-btn-primary"
                                    disabled={bookingStatus.type === "loading" || bookingStatus.type === "success" || days < 1}
                                >
                                    {bookingStatus.type === "loading" ? "Processing..." :
                                        bookingStatus.type === "success" ? "Success!" : "Confirm Booking"}
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
export default UserDashboard;