import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./viewbyid.css";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
const ChadParbaDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8800/api/chadparba/${id}`);
                setEvent(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching event:", err);
                setError(true);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading event details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12" y2="17" />
                    </svg>
                </div>
                <h2>Error Loading Event</h2>
                <p>We couldn't load the requested event. Please try again later.</p>
                <Link to="/events" className="back-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    Back to Events
                </Link>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <Header />
            <div className="chadparba-detail">
                <div className="hero-section">
                    <div className="hero-content">
                        <Link to="/events" className="back-link">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Back to Events
                        </Link>
                        <div className="event-meta">
                            <div className="date-badge">
                                <span className="month">{event.nepaliMonth}</span>
                                <span className="day">{event.nepaliDay}</span>
                            </div>
                            <div className="category-tag">{event.category}</div>
                        </div>
                        <h1>{event.title}</h1>
                        <div className="divider"></div>
                    </div>
                    <div className="hero-pattern"></div>
                </div>

                <div className="detail-content">
                    <div className="content-wrapper">
                        <div className="event-description">
                            <h2>About this Festival</h2>
                            <p>{event.description}</p>
                        </div>

                        <div className="additional-info">
                            <div className="info-card">
                                <div className="info-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <h3>Date Information</h3>
                                </div>
                                <div className="info-content">
                                    <div className="info-row">
                                        <span>Nepali Month:</span>
                                        <span>{event.nepaliMonth}</span>
                                    </div>
                                    <div className="info-row">
                                        <span>Nepali Day:</span>
                                        <span>{event.nepaliDay}</span>
                                    </div>
                                    <div className="info-row">
                                        <span>Category:</span>
                                        <span>{event.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <h3>Event Details</h3>
                                </div>
                                <div className="info-content">
                                    <div className="info-row">
                                        <span>Duration:</span>
                                        <span>1 day festival</span>
                                    </div>
                                    <div className="info-row">
                                        <span>Significance:</span>
                                        <span>Cultural celebration</span>
                                    </div>
                                    <div className="info-row">
                                        <span>Region:</span>
                                        <span>Nationwide</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ChadParbaDetail;