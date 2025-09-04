import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faHotel,
    faMoneyBillWave,
    faClock,
    faSpinner,
    faBan,
    faCheckCircle,
    faTimesCircle,
    faInfoCircle,
    faFilter
} from "@fortawesome/free-solid-svg-icons";
import "./booked.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const Bookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [filter, setFilter] = useState("all"); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    useEffect(() => {
        // Apply filter whenever bookings or filter changes
        if (filter === "all") {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(booking => booking.status === filter));
        }
    }, [bookings, filter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `http://localhost:8800/api/reservations/user`,
                { withCredentials: true }
            );
            setBookings(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        setCancellingId(bookingId);
        try {
            await axios.put(
                `http://localhost:8800/api/reservations/${bookingId}/request-cancel`,
                {},
                { withCredentials: true }
            );
            await fetchBookings();
            alert("Cancellation request submitted. Waiting for admin approval.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel booking");
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateTotalNights = (dates) => {
        if (!dates || !Array.isArray(dates) || dates.length === 0) return 0;
        
        // Sort dates to ensure chronological order
        const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b));
        const start = new Date(sortedDates[0]);
        const end = new Date(sortedDates[sortedDates.length - 1]);
        
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            confirmed: { icon: faCheckCircle, class: "confirmed", label: "Confirmed" },
            cancelled: { icon: faBan, class: "cancelled", label: "Cancelled" },
            pending: { icon: faSpinner, class: "pending", label: "Pending", spin: true },
            cancel_requested: { icon: faTimesCircle, class: "cancel-requested", label: "Cancel Requested" }
        };

        const currentStatus = statusMap[status] || { icon: faInfoCircle, class: "unknown", label: "Unknown" };

        return (
            <span className={`status-badge ${currentStatus.class}`}>
                <FontAwesomeIcon icon={currentStatus.icon} spin={currentStatus.spin} />
                {currentStatus.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bookings-loading">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Loading your bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bookings-error">
                <FontAwesomeIcon icon={faTimesCircle} />
                <p>{error}</p>
                <button onClick={fetchBookings}>Try Again</button>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <Header type="list" />
            <div className="bookings-container">
                <div className="bookings-header">
                    <h1>My Bookings</h1>
                    <div className="bookings-filter">
                        <FontAwesomeIcon icon={faFilter} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Bookings</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancel_requested">Cancel Requests</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="no-bookings">
                        <FontAwesomeIcon icon={faHotel} size="3x" />
                        <p>No {filter === "all" ? "" : filter.replace("_", " ") + " "}bookings found</p>
                        <button onClick={() => navigate("/stays")}>Explore Hotels</button>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {filteredBookings.map((booking) => {
                            const hotelName = booking.hotelId?.name || "Hotel";
                            const firstPhoto = booking.hotelId?.photos?.[0];
                            const dates = Array.isArray(booking.dates) ? booking.dates : [];
                            const startDate = dates[0];
                            const endDate = dates[dates.length - 1];
                            const status = booking.status || "unknown";
                            const nights = calculateTotalNights(dates);
                            const isCancelDisabled = ["cancelled", "pending", "cancel_requested"].includes(status);

                            return (
                                <div key={booking._id} className="booking-card">
                                    <div className="booking-header">
                                        <h2>{hotelName}</h2>
                                        <div className="status-container">
                                            {getStatusBadge(status)}
                                        </div>
                                    </div>

                                    <div className="booking-image">
                                        {firstPhoto ? (
                                            <img
                                                src={firstPhoto}
                                                alt={hotelName}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/default-hotel.jpg';
                                                }}
                                            />
                                        ) : (
                                            <div className="image-placeholder">
                                                <FontAwesomeIcon icon={faHotel} size="2x" />
                                                <span>No Image Available</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-item">
                                            <FontAwesomeIcon icon={faCalendarDays} />
                                            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FontAwesomeIcon icon={faClock} />
                                            <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                            <span>Rs. {booking.totalPrice?.toLocaleString() || "N/A"}</span>
                                        </div>
                                        {booking.roomDetails && booking.roomDetails.length > 0 && (
                                            <div className="detail-item">
                                                <FontAwesomeIcon icon={faHotel} />
                                                <span>
                                                    {booking.roomDetails.length} room{booking.roomDetails.length !== 1 ? 's' : ''}: {
                                                        booking.roomDetails.map(room => room.title).join(', ')
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="booking-actions">
                                        {booking.hotelId?._id && (
                                            <button
                                                onClick={() => navigate(`/hotels/${booking.hotelId._id}`)}
                                            >
                                                View Hotel
                                            </button>
                                        )}
                                        <button
                                            className="cancel-btn"
                                            onClick={() => handleCancel(booking._id)}
                                            disabled={isCancelDisabled || cancellingId === booking._id}
                                        >
                                            {cancellingId === booking._id ? (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} spin /> Processing...
                                                </>
                                            ) : (
                                                "Request Cancellation"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Bookings;