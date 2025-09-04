"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HotelsInformation.css";

const ChevronLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
);

const ChevronRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
);

const MapPin = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const Star = ({ filled }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={filled ? "#fbbf24" : "none"}
        stroke="#fbbf24"
        strokeWidth="2"
    >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
);

const HalfStar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
        <defs>
            <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="transparent" />
            </linearGradient>
        </defs>
        <polygon 
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
            fill="url(#half-star)" 
            stroke="#fbbf24"
        />
    </svg>
);

function NepalHotelCarousel() {
    const [hotels, setHotels] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const hotelsPerPage = 3;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get("http://localhost:8800/api/hotels");
                setHotels(res.data);
            } catch (error) {
                console.error("Failed to fetch hotels:", error);
            }
        };

        fetchHotels();
    }, []);

    const totalPages = Math.ceil(hotels.length / hotelsPerPage);

    const slideNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const slidePrev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const getCurrentHotels = () => {
        const startIndex = currentPage * hotelsPerPage;
        return hotels.slice(startIndex, startIndex + hotelsPerPage);
    };

    const renderStars = (rating) => {
        if (!rating || rating === 0) {
            return Array(5).fill(null).map((_, i) => <Star key={`empty-${i}`} filled={false} />);
        }

        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={`full-${i}`} filled={true} />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<HalfStar key={`half-${i}`} />);
            } else {
                stars.push(<Star key={`empty-${i}`} filled={false} />);
            }
        }
        return stars;
    };

    const getCityClass = (city) => {
        if (city === "Kathmandu") return "city-kathmandu";
        if (city === "Lalitpur") return "city-lalitpur";
        if (city === "Bhaktapur") return "city-bhaktapur";
        return "city-default";
    };

    const formatPrice = (price) => {
        if (!price) return "Price N/A";
        return `Rs. ${price.toLocaleString()}/night`;
    };

    const getAmenities = (hotelName) => {
        const amenitiesMap = {
            "Grand Hotel Kathmandu": ["Luxury Suite", "Infinity Pool", "Royal Spa"],
            "Vivanta Kathmandu": ["Business Center", "Fine Dining", "High-Speed WiFi"],
            "Hotel Heritage": ["Cultural Tours", "Heritage Architecture", "Traditional Cuisine"],
            "Hyatt Regency Kathmandu": ["Premium Rooms", "Casino Gaming", "Event Halls"],
            "Hotel Himalaya": ["Himalayan Views", "Botanical Garden", "Multi-Cuisine"],
            "Peacock Guest House": ["Budget Friendly", "Homely Atmosphere", "Local Experience"],
            "Gokarna Forest Resort": ["Forest Retreat", "Golf Course", "Wildlife Safari"],
            "Summit Hotel": ["Valley Panorama", "Corporate Facilities", "Contemporary Design"],
            "Tulaja Boutique Hotel": ["Artistic Interiors", "Personalized Service", "Boutique Experience"],
            "Hotel Annapurna": ["Mountain Cuisine", "Trekking Base", "Adventure Tours"],
            "Kathmandu Guest House": ["Historic Charm", "Courtyard Dining", "Cultural Hub"],
            "Hotel Shanker": ["Palace Heritage", "Royal Gardens", "Vintage Luxury"],
            "Dwarika's Hotel": ["Newari Architecture", "Handcrafted Decor", "Cultural Immersion"],
            "Hotel Yak & Yeti": ["Casino Resort", "Shopping Arcade", "Entertainment Hub"],
            "Radisson Hotel": ["Sky Lounge", "Fitness Center", "Airport Shuttle"],
        };
        return amenitiesMap[hotelName] || ["Quality Service", "Clean Rooms", "Friendly Staff"];
    };

    return (
        <div className="main-container">
            <h1 className="hotelpagetitle">Enjoy a Luxury Stay with Us</h1>
            <div className="carousel-container">
                <button className="slider__btn-prev" onClick={slidePrev}>
                    <ChevronLeft />
                </button>
                <div className="hotels-container">
                    {getCurrentHotels().map((hotel) => (
                        <div key={hotel._id || hotel.id} className="hotel-item">
                            <div className="hotel-image-section">
                                <img
                                    src={hotel.photos?.[0] || hotel.image || "/placeholder.svg"}
                                    alt={hotel.name}
                                    className="hotel-photo"
                                    onError={(e) => {
                                        e.target.src = "/placeholder.svg?height=300&width=400";
                                    }}
                                />
                                <div className="rating-container">
                                    <div className="stars-wrapper">
                                        {renderStars(hotel.rating)}
                                    </div>
                                    <span className="rating-number">
                                        {hotel.rating ? hotel.rating.toFixed(1) : "N/A"}
                                    </span>
                                </div>
                                <div className={`city-label ${getCityClass(hotel.city)}`}>
                                    {hotel.city}
                                </div>
                            </div>
                            <div className="hotel-details">
                                <div className="hotel-title-section">
                                    <h3 className="hotel-title">{hotel.name}</h3>
                                    <div className="price-display">{formatPrice(hotel.cheapestPrice)}</div>
                                </div>

                                <div className="location-section">
                                    <MapPin />
                                    <p className="location-text">{hotel.city}, Nepal</p>
                                </div>

                                <div className="features-section">
                                    {getAmenities(hotel.name).map((amenity, idx) => (
                                        <span key={idx} className="feature-item">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    className="booking-button"
                                    onClick={() => navigate(`/hotels/${hotel._id || hotel.id}`)}
                                >
                                    <span>Book Now</span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7,7 17,7 17,17"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="slider__btn-next" onClick={slideNext}>
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}

export default NepalHotelCarousel;