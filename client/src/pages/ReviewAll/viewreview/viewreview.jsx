"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FaStar,
    FaFilter,
    FaHotel,
    FaMapMarkedAlt,
    FaExchangeAlt,
    FaMapMarkerAlt,
    FaExclamationTriangle,
    FaEdit,
    FaChevronDown,
    FaChevronUp,
    FaUser,
    FaArrowLeft,
    FaArrowRight
} from "react-icons/fa";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import "./viewreview.css";

const FILTER_OPTIONS = [
    { label: "All", value: "all", icon: <FaStar className="filter-icon" /> },
    { label: "Hotel", value: "Hotel", icon: <FaHotel className="filter-icon" /> },
    { label: "Tourist Guide", value: "TouristGuide", icon: <FaMapMarkedAlt className="filter-icon" /> },
    { label: "Money Exchange", value: "ExchangeCenter", icon: <FaExchangeAlt className="filter-icon" /> },
    { label: "Place", value: "Place", icon: <FaMapMarkerAlt className="filter-icon" /> }
];

const AllReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 8;

    const fetchReviews = async (filter) => {
        setIsLoading(true);
        setError(null);

        try {
            if (filter === "all") {
                const res = await axios.get("http://localhost:8800/api/review");
                setReviews(res.data);
            } else {
                const res = await axios.get(`http://localhost:8800/api/review/model/${filter}`);
                setReviews(res.data);
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load reviews. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(selectedFilter);
    }, [selectedFilter]);

    // Pagination logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="all-reviews-container">
            <Navbar />
            <Header />
            <main className="reviews-main">
                <div className="reviews-header">
                    <h1 className="page-title">
                        <FaStar className="star-icon" />
                        All Reviews
                        <FaStar className="star-icon" />
                    </h1>
                    <p className="page-subtitle">
                        Discover what others are saying about their experiences
                    </p>
                </div>

                {/* Filter Section */}
                <div className="filter-section">
                    <div
                        className="mobile-filter-toggle"
                        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    >
                        <FaFilter className="filter-icon" />
                        <span>Filter Reviews</span>
                        {mobileFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>

                    <div className={`filter-container ${mobileFilterOpen ? 'mobile-open' : ''}`}>
                        {FILTER_OPTIONS.map(({ label, value, icon }) => (
                            <button
                                key={value}
                                className={`filter-button ${selectedFilter === value ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedFilter(value);
                                    setCurrentPage(1);
                                }}
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading reviews...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="error-container">
                        <div className="error-icon">
                            <FaExclamationTriangle className="error-icon-svg" />
                        </div>
                        <p className="error-message">{error}</p>
                        <button
                            className="retry-button"
                            onClick={() => fetchReviews(selectedFilter)}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* No Reviews State */}
                {!isLoading && !error && reviews.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FaEdit className="empty-icon-svg" />
                        </div>
                        <h3>No Reviews Found</h3>
                        <p>There are no reviews for "{selectedFilter}". Try another filter.</p>
                    </div>
                )}

                {/* Reviews Grid */}
                {!isLoading && !error && reviews.length > 0 && (
                    <>
                        <div className="reviews-grid">
                            {currentReviews.map((review) => (
                                <div key={review._id} className="review-card">
                                    <div className="card-header">
                                        <div className="item-type-badge">
                                            {FILTER_OPTIONS.find(opt => opt.value === review.reviewedModel)?.icon ||
                                                <FaStar className="filter-icon" />}
                                        </div>
                                        <div className="item-info">
                                            <h3 className="item-name">
                                                {review.reviewedItem?.name || "Unknown Item"}
                                            </h3>
                                            <span className="item-type">
                                                {review.reviewedModel}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rating-container">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`star ${i < review.rating ? "filled" : ""}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="rating-value">{review.rating.toFixed(1)}</span>
                                    </div>

                                    <p className="review-comment">{review.comment}</p>

                                    <div className="review-meta">
                                        <div className="reviewer-info">
                                            <div className="reviewer-avatar">
                                                {review.userId?.username?.charAt(0) || <FaUser />}
                                            </div>
                                            <span className="reviewer-name">
                                                {review.userId?.username || "Unknown User"}
                                            </span>
                                        </div>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <FaArrowLeft className="pagination-icon" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => paginate(page)}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <FaArrowRight className="pagination-icon" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AllReviewsPage;