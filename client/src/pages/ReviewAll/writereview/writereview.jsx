"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "../../../utils/api"; // axios instance with credentials/token
import {
    FaStar,
    FaMapMarkerAlt,
    FaBuilding,
    FaDollarSign,
    FaUsers,
} from "react-icons/fa";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import "./writereview.css";

const ReviewPage = () => {
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [userReviews, setUserReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setAuthChecked(true);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm.length >= 2) fetchSuggestions(searchTerm);
            else setSuggestions([]);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const fetchSuggestions = async (term) => {
        setIsLoading(true);
        try {
            const res = await api.get("/search", {
                params: { query: term },
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error("Search error:", err.response || err);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    
    const fetchUserReviews = useCallback(async () => {
        if (!user || !user._id) return;
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await api.get(`/review/user/${user._id}`);
            setUserReviews(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Fetch review error:", err.response || err);
            setMessage("Failed to load your reviews.");
            setMessageType("error");
            setUserReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) fetchUserReviews();
    }, [user, fetchUserReviews]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItem || !user) return;

        try {
            const res = await api.post("/review", {
                userId: user._id,
                reviewedItem: selectedItem._id,
                reviewedModel: selectedItem.reviewedModel,
                rating,
                comment: comment.trim(),
            });

            const reviewId = res?.data?._id || res?.data?.review?._id;
            if (reviewId) {
                setRating(0);
                setComment("");
                setSelectedItem(null);
                setSearchTerm("");
                setSuggestions([]);
                await fetchUserReviews();
                setMessage("Review submitted successfully!");
                setMessageType("success");
            } else {
                throw new Error(res.data?.message || "Failed to submit");
            }
        } catch (err) {
            console.error("Submit error:", err.response || err.message || err);
            const msg = err.response?.data?.message || err.message || "An error occurred";
            setMessage(msg);
            setMessageType("error");
        }

        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 4000);
    };

    const getIcon = (type) =>
    ({
        Place: <FaMapMarkerAlt />,
        Hotel: <FaBuilding />,
        ExchangeCenter: <FaDollarSign />,
        TouristGuide: <FaUsers />,
    }[type] || <FaMapMarkerAlt />);

    const getTypeClass = (type) =>
    ({
        Place: "writereview-badge-place",
        Hotel: "writereview-badge-hotel",
        ExchangeCenter: "writereview-badge-exchange",
        TouristGuide: "writereview-badge-guide",
    }[type] || "writereview-badge-default");

    if (!authChecked) return <p>Checking authentication...</p>;
    if (!user) {
        window.location.href = "/login";
        return null;
    }

    return (
        <div className="writereview-review-page-container">
            <Navbar />
            <Header />
            <main className="writereview-review-main">
                <div className="writereview-hero-section">
                    <h1>Write a review</h1>
                    <p>Share your experience to help future travelers.</p>
                </div>

                <form className="writereview-review-form" onSubmit={handleReviewSubmit}>
                    <div className="writereview-search-section">
                        <input
                            type="text"
                            placeholder="Search hotels, places, guides, exchanges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isLoading && <span>Searching...</span>}
                    </div>

                    {suggestions.length > 0 && (
                        <div className="writereview-suggestions-container">
                            {suggestions.map((item) => (
                                <div
                                    key={item._id}
                                    className={`writereview-suggestion-item ${selectedItem?._id === item._id ? "writereview-selected" : ""
                                        }`}
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setSearchTerm(item.name);
                                        setSuggestions([]);
                                    }}
                                >
                                    <div className="writereview-left">
                                        {getIcon(item.reviewedModel)}
                                        <div>
                                            <h4>{item.name}</h4>
                                            {item.city && <small>{item.city}</small>}
                                        </div>
                                    </div>
                                    {item.reviewedModel && (
                                        <span className={getTypeClass(item.reviewedModel)}>
                                            {item.reviewedModel}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {message && (
                        <div
                            className={`writereview-alert-message ${messageType === "success"
                                ? "writereview-alert-success"
                                : "writereview-alert-error"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    {selectedItem ? (
                        <>
                            <h2>Review {selectedItem.name}</h2>
                            <div className="writereview-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={rating >= star ? "writereview-filled" : ""}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Your review..."
                                required
                                minLength={10}
                            />
                            <button
                                type="submit"
                                disabled={!rating || comment.trim().length < 10 || isLoading}
                            >
                                {isLoading ? "Submitting..." : "Submit Review"}
                            </button>
                        </>
                    ) : (
                        <p>Select something to review above.</p>
                    )}
                </form>

                <div className="writereview-user-reviews">
                    <h3>Your Previous Reviews ({userReviews.length})</h3>
                    {userReviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        (userReviews || []).map((rev) => (
                            <div key={rev._id} className="writereview-review-item">
                                <strong>{rev.reviewedModel}</strong>: {rev.reviewedItem?.name || "Unknown"}
                                <div>
                                    {[...Array(rev.rating)].map((_, i) => (
                                        <FaStar key={i} color="gold" />
                                    ))}
                                    {[...Array(5 - rev.rating)].map((_, i) => (
                                        <FaStar key={`empty-${i}`} color="#ccc" />
                                    ))}
                                </div>
                                <p>{rev.comment}</p>
                                <small>{new Date(rev.createdAt).toLocaleDateString()}</small>
                            </div>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReviewPage;
