import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaCalendarAlt, FaStar, FaStarHalfAlt, FaUser, FaMoneyBill, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";

import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

import "./touristguiderdashboard.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";

const TouristGuideDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [guideProfile, setGuideProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bookings");
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [updateStatus, setUpdateStatus] = useState({ message: "", type: "" });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="star full" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star half" />);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
        }

        return <div className="stars">{stars}</div>;
    };

    // Fetch guide bookings
    const fetchGuideBookings = async () => {
        try {
            if (user?._id) {
                const response = await fetch(`${BASE_URL}/api/touristguide/bookings/guide/${user._id}`, {
                    credentials: "include"
                });
                if (response.ok) {
                    const bookingsData = await response.json();
                    setBookings(bookingsData);
                }
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    // Fetch guide profile
    const fetchGuideProfile = async () => {
        try {
            if (user?._id) {
                const response = await fetch(`${BASE_URL}/api/touristguide/${user._id}`, {
                    credentials: "include"
                });
                if (response.ok) {
                    const profileData = await response.json();
                    setGuideProfile(profileData);
                    setEditFormData(profileData);
                }
            }
        } catch (error) {
            console.error("Error fetching guide profile:", error);
        }
    };

    // Fetch guide reviews
    const fetchGuideReviews = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/review/`);
            if (response.ok) {
                const data = await response.json();
                let allReviews = Array.isArray(data) ? data : data.data || [];
                // Filter reviews for this guide
                const guideReviews = allReviews.filter(
                    (r) => r.reviewedItem?._id === user._id && r.reviewedModel === "TouristGuide"
                );
                setReviews(guideReviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    // Update booking status
    const updateBookingStatus = async (bookingId, status) => {
        try {
            const response = await fetch(`${BASE_URL}/api/touristguide/bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                alert("Booking status updated successfully!");
                fetchGuideBookings(); // Refresh bookings
            } else {
                alert("Failed to update booking status");
            }
        } catch (error) {
            console.error("Error updating booking status:", error);
            alert("An error occurred while updating booking status");
        }
    };

    // Cancel booking
    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const reason = prompt("Please provide a reason for cancellation:");
                if (reason === null) return;

                const response = await fetch(`${BASE_URL}/api/touristguide/cancel/${bookingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ reason, cancelledBy: "guide" })
                });

                if (response.ok) {
                    alert("Booking cancelled successfully!");
                    fetchGuideBookings(); // Refresh bookings
                } else {
                    alert("Failed to cancel booking");
                }
            } catch (error) {
                console.error("Error cancelling booking:", error);
                alert("An error occurred while cancelling the booking");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "category") {
            // Handle multi-select for categories
            const options = e.target.options;
            const selectedValues = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    selectedValues.push(options[i].value);
                }
            }
            setEditFormData({
                ...editFormData,
                [name]: selectedValues
            });
        } else if (name === "experience" || name === "pricePerDay" || name === "maxGroupSize") {
            // Handle numeric fields
            setEditFormData({
                ...editFormData,
                [name]: Number(value)
            });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value
            });
        }
    };

    // Save updated profile
    const handleSaveProfile = async () => {
        try {
            setUpdateStatus({ message: "Updating profile...", type: "loading" });
            
            const response = await fetch(`${BASE_URL}/api/touristguide/${guideProfile._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(editFormData)
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setGuideProfile(updatedProfile);
                setIsEditing(false);
                setUpdateStatus({ message: "Profile updated successfully!", type: "success" });
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setUpdateStatus({ message: "", type: "" });
                }, 3000);
            } else {
                const errorData = await response.json();
                setUpdateStatus({ 
                    message: errorData.message || "Failed to update profile", 
                    type: "error" 
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setUpdateStatus({ 
                message: "An error occurred while updating profile", 
                type: "error" 
            });
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditFormData(guideProfile);
        setIsEditing(false);
        setUpdateStatus({ message: "", type: "" });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchGuideBookings(),
                    fetchGuideProfile(),
                    fetchGuideReviews()
                ]);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Calculate average rating from reviews
    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

    // Category options for the select dropdown
    const categoryOptions = [
        "Adventure", "Cultural", "Historical", "Wildlife", 
        "Religious", "Eco-tourism", "Trekking", "Local Experience"
    ];

    return (
        <>
            <Navbar />
            <Header />
            <div className="app-container">
                <div className="tourist-guide-dashboard">
                    <div className="dashboard-hero">
                        <div className="hero-content">
                            <h1>Namaste, {guideProfile?.name || "Tourist Guide"}!</h1>
                            <p>Manage your bookings and provide excellent service to tourists in Nepal</p>
                            <div className="stats-container">
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.filter(b => b.status === "confirmed").length}</div>
                                    <div className="stat-label">Upcoming Tours</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.filter(b => b.status === "completed").length}</div>
                                    <div className="stat-label">Completed</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{reviews.length}</div>
                                    <div className="stat-label">Reviews</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-tabs">
                        {["bookings", "reviews", "profile", "chat"].map((tab) => (
                            <button
                                key={tab}
                                className={`dashboard-tab ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Bookings Section */}
                    {activeTab === "bookings" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Your Bookings</h2>
                                <div className="filters">
                                    <select onChange={(e) => {
                                        // Filter logic would go here
                                    }}>
                                        <option value="all">All</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading bookings...</p>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📅</div>
                                    <h3>No bookings yet</h3>
                                    <p>Your upcoming tours will appear here</p>
                                </div>
                            ) : (
                                <div className="booking-list">
                                    {bookings.map((booking, index) => (
                                        <div
                                            className={`booking-card booking-status-${booking.status}`}
                                            key={booking._id}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="booking-header">
                                                <div className="booking-tourist">
                                                    <div className="avatar">
                                                        {booking.userId?.username?.charAt(0) || <FaUser />}
                                                    </div>
                                                    <div>
                                                        <div className="tourist-name">
                                                            {booking.userId?.username || "Tourist"}
                                                        </div>
                                                        <div className="tourist-contact">
                                                            <FaPhoneAlt className="icon" /> 
                                                            {booking.userId?.contactNumber || "Not provided"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="booking-date">
                                                    <FaCalendarAlt className="icon" />
                                                    <div>
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="booking-details">
                                                <div className="detail">
                                                    <FaMapMarkerAlt className="icon" />
                                                    <span>{guideProfile?.location || "Nepal"}</span>
                                                </div>
                                                <div className="detail">
                                                    <GiPathDistance className="icon" />
                                                    <span>
                                                        {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} days
                                                    </span>
                                                </div>
                                                <div className="detail">
                                                    <FaUser className="icon" />
                                                    <span>Group: {booking.groupSize} people</span>
                                                </div>
                                                <div className="detail">
                                                    <FaMoneyBill className="icon" />
                                                    <span>Rs. {booking.totalPrice}</span>
                                                </div>
                                            </div>

                                            <div className="booking-status">
                                                Status: <span className={`status-${booking.status}`}>{booking.status}</span>
                                                {booking.cancellationReason && (
                                                    <div className="cancellation-reason">
                                                        Reason: {booking.cancellationReason}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="booking-actions">
                                                <button className="btn outline" onClick={() => {
                                                    // View details logic
                                                }}>
                                                    Details
                                                </button>
                                                {booking.status === "confirmed" && (
                                                    <>
                                                        <button 
                                                            className="btn primary"
                                                            onClick={() => updateBookingStatus(booking._id, "completed")}
                                                        >
                                                            Mark Complete
                                                        </button>
                                                        <button 
                                                            className="btn warning"
                                                            onClick={() => handleCancelBooking(booking._id)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Reviews Section */}
                    {activeTab === "reviews" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Your Reviews</h2>
                                {reviews.length > 0 && (
                                    <div className="rating-summary">
                                        <div className="average-rating">
                                            {averageRating.toFixed(1)}
                                        </div>
                                        <div className="rating-stars">
                                            {renderStars(averageRating)}
                                            <div className="rating-count">({reviews.length} reviews)</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">⭐</div>
                                    <h3>No reviews yet</h3>
                                    <p>Your reviews will appear here</p>
                                </div>
                            ) : (
                                <div className="review-list">
                                    {reviews.map((review) => (
                                        <div className="review-card" key={review._id}>
                                            <div className="review-header">
                                                <div className="reviewer">
                                                    <div className="avatar">{review.userId?.username?.charAt(0) || "U"}</div>
                                                    <div className="reviewer-name">{review.userId?.username || "User"}</div>
                                                </div>
                                                <div className="review-rating">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <div className="review-content">
                                                <MdRateReview className="icon" />
                                                <p>{review.comment}</p>
                                            </div>
                                            <div className="review-date">
                                                Posted {new Date(review.createdAt || review.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Profile Section */}
                    {activeTab === "profile" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Your Guide Profile</h2>
                                {!isEditing ? (
                                    <button 
                                        className="btn primary" 
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button 
                                            className="btn success" 
                                            onClick={handleSaveProfile}
                                        >
                                            <FaSave /> Save
                                        </button>
                                        <button 
                                            className="btn warning" 
                                            onClick={handleCancelEdit}
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {updateStatus.message && (
                                <div className={`update-status ${updateStatus.type}`}>
                                    {updateStatus.message}
                                </div>
                            )}

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading profile...</p>
                                </div>
                            ) : (
                                <div className="profile-container">
                                    <div className="profile-card">
                                        <div className="profile-header">
                                            <div className="avatar">
                                                {guideProfile?.img ? (
                                                    <img src={guideProfile.img} alt={guideProfile.name} />
                                                ) : (
                                                    guideProfile?.name?.charAt(0) || "G"
                                                )}
                                            </div>
                                            <div className="profile-info">
                                                {isEditing ? (
                                                    <div className="edit-field">
                                                        <label>Name:</label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={editFormData.name || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                ) : (
                                                    <h3>{guideProfile?.name || "Tourist Guide"}</h3>
                                                )}
                                                {isEditing ? (
                                                    <div className="edit-field">
                                                        <label>Experience (years):</label>
                                                        <input
                                                            type="number"
                                                            name="experience"
                                                            value={editFormData.experience || 0}
                                                            onChange={handleInputChange}
                                                            min="0"
                                                        />
                                                    </div>
                                                ) : (
                                                    <p>{guideProfile?.experience || "0"} years experience</p>
                                                )}
                                                {reviews.length > 0 && (
                                                    <div className="rating">
                                                        {renderStars(averageRating)}
                                                        <span>
                                                            {averageRating.toFixed(1)} ({reviews.length} reviews)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="profile-details">
                                            <div className="detail">
                                                <label>Specialties:</label>
                                                {isEditing ? (
                                                    <select
                                                        name="category"
                                                        multiple
                                                        value={editFormData.category || []}
                                                        onChange={handleInputChange}
                                                        size="3"
                                                    >
                                                        {categoryOptions.map(cat => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span>
                                                        {guideProfile?.category?.join(", ") || "Not specified"}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="detail">
                                                <label>Languages:</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="language"
                                                        value={editFormData.language || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                ) : (
                                                    <span>{guideProfile?.language || "Not specified"}</span>
                                                )}
                                            </div>
                                            <div className="detail">
                                                <label>Location:</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={editFormData.location || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                ) : (
                                                    <span>{guideProfile?.location || "Not specified"}</span>
                                                )}
                                            </div>
                                            <div className="detail">
                                                <label>Price per day:</label>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        name="pricePerDay"
                                                        value={editFormData.pricePerDay || 0}
                                                        onChange={handleInputChange}
                                                        min="0"
                                                    />
                                                ) : (
                                                    <span>Rs. {guideProfile?.pricePerDay || "0"} per day</span>
                                                )}
                                            </div>
                                            <div className="detail">
                                                <label>Max Group Size:</label>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        name="maxGroupSize"
                                                        value={editFormData.maxGroupSize || 5}
                                                        onChange={handleInputChange}
                                                        min="1"
                                                    />
                                                ) : (
                                                    <span>{guideProfile?.maxGroupSize || "Not specified"}</span>
                                                )}
                                            </div>
                                            <div className="detail">
                                                <label>Contact:</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="contactNumber"
                                                        value={editFormData.contactNumber || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                ) : (
                                                    <span>{guideProfile?.contactNumber || "Not provided"}</span>
                                                )}
                                            </div>
                                            <div className="detail">
                                                <label>License Number:</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="licenseNumber"
                                                        value={editFormData.licenseNumber || ""}
                                                        onChange={handleInputChange}
                                                        pattern="^TCB\/TG\([A-Z/_]+\)-\d{2}\/\d{4,5}$"
                                                        title="Format: TCB/TG(XXXX)-XX/XXXX"
                                                    />
                                                ) : (
                                                    <span>{guideProfile?.licenseNumber || "Not provided"}</span>
                                                )}
                                            </div>
                                            <div className="detail">
                                                <label>Availability:</label>
                                                {isEditing ? (
                                                    <select
                                                        name="isAvailable"
                                                        value={editFormData.isAvailable ? "true" : "false"}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            isAvailable: e.target.value === "true"
                                                        })}
                                                    >
                                                        <option value="true">Available</option>
                                                        <option value="false">Unavailable</option>
                                                    </select>
                                                ) : (
                                                    <span>{guideProfile?.isAvailable ? "Available" : "Unavailable"}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="profile-stats">
                                            <div className="stat">
                                                <div className="value">{bookings.length}</div>
                                                <div className="label">Total Bookings</div>
                                            </div>
                                            <div className="stat">
                                                <div className="value">
                                                    {bookings.filter(b => b.status === "completed").length}
                                                </div>
                                                <div className="label">Completed</div>
                                            </div>
                                            <div className="stat">
                                                <div className="value">{reviews.length}</div>
                                                <div className="label">Reviews</div>
                                            </div>
                                        </div>

                                        {!isEditing && (
                                            <div className="profile-actions">
                                                <button 
                                                    className="btn outline"
                                                    onClick={() => navigate(`/guide/${guideProfile?._id}`)}
                                                >
                                                    View Public Profile
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Chat Section */}
                    {activeTab === "chat" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Tourist Messages</h2>
                            </div>

                            <div className="chat-preview">
                                {bookings.filter(b => b.status === "confirmed").length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">💬</div>
                                        <h3>No active bookings</h3>
                                        <p>You'll see messages from tourists with confirmed bookings</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="chat-list">
                                            {bookings.filter(b => b.status === "confirmed").slice(0, 3).map((booking) => (
                                                <div className="chat-item" key={booking._id}>
                                                    <div className="avatar">
                                                        {booking.userId?.username?.charAt(0) || "T"}
                                                    </div>
                                                    <div className="chat-info">
                                                        <div className="chat-header">
                                                            <div className="name">{booking.userId?.username || "Tourist"}</div>
                                                            <div className="tour-date">
                                                                Tour: {new Date(booking.startDate).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="message-preview">
                                                            Click to chat about your upcoming tour...
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="chat-actions">
                                            <button 
                                                className="btn primary" 
                                                onClick={() => navigate("/chat")}
                                            >
                                                Open Chat Dashboard
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TouristGuideDashboard;