import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import './moneyexchange.css';

const MoneyExchangeApp = () => {
    const [filteredCenters, setFilteredCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userLocation, setUserLocation] = useState(null);
    const centersPerPage = 3;
    const defaultRadius = 10;

    // Haversine distance calculation
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Get user location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Location error:", error);
                }
            );
        }
    };

    // Fetch exchange centers
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8800/api/money-exchange');
            let centersData = response.data.data || [];

            if (userLocation) {
                centersData = centersData.map(center => {
                    const distance = haversineDistance(
                        userLocation.lat,
                        userLocation.lng,
                        center.lat || center.latitude,
                        center.lng || center.longitude
                    );
                    return {
                        ...center,
                        distance,
                        isWithinRadius: distance <= defaultRadius
                    };
                }).filter(center => center.isWithinRadius)
                  .sort((a, b) => a.distance - b.distance);
            }

            setFilteredCenters(centersData);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [userLocation, defaultRadius]);

    useEffect(() => {
        getUserLocation();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Simple image display without slider
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    const nextImage = (centerId, totalImages) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [centerId]: ((prev[centerId] || 0) + 1) % totalImages
        }));
    };

    const prevImage = (centerId, totalImages) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [centerId]: ((prev[centerId] || 0) - 1 + totalImages) % totalImages
        }));
    };

    // Pagination logic
    const indexOfLastCenter = currentPage * centersPerPage;
    const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
    const currentCenters = filteredCenters.slice(indexOfFirstCenter, indexOfLastCenter);
    const totalPages = Math.ceil(filteredCenters.length / centersPerPage);

    const paginate = (direction) => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) return <div className="loading-spinner"></div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="money-exchange-container">
            <h1 className="main-title">Nearby Money Exchange Centers</h1>
            
            <div className="exchange-centers-grid">
                {currentCenters.map((center) => (
                    <div key={center._id} className="exchange-center-card">
                        <div className="image-slider-container">
                            {center.images && center.images.length > 0 ? (
                                <div className="simple-slider">
                                    <img 
                                        src={center.images[currentImageIndex[center._id] || 0]} 
                                        alt={center.name} 
                                        className="center-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                    {center.images.length > 1 && (
                                        <>
                                            <button 
                                                className="slider-btn prev-btn"
                                                onClick={() => prevImage(center._id, center.images.length)}
                                            >
                                                ‹
                                            </button>
                                            <button 
                                                className="slider-btn next-btn"
                                                onClick={() => nextImage(center._id, center.images.length)}
                                            >
                                                ›
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="center-image-wrapper">
                                    <img 
                                        src="https://via.placeholder.com/400x300?text=No+Image" 
                                        alt="Placeholder"
                                        className="center-image"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="center-details">
                            <h2 className="center-name">{center.name}</h2>
                            <p className="center-address">
                                <i className="fas fa-map-marker-alt"></i> {center.address}
                            </p>
                            {center.distance && (
                                <p className="center-distance">
                                    <i className="fas fa-location-arrow"></i> 
                                    {center.distance.toFixed(1)} km away
                                </p>
                            )}
                            <p className="center-contact">
                                <i className="fas fa-phone"></i> {center.contactNumber}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCenters.length > centersPerPage && (
                <div className="pagination-controls">
                    <button 
                        onClick={() => paginate('prev')} 
                        disabled={currentPage === 1}
                        className="pagination-button prev-button"
                    >
                        <i className="fas fa-chevron-left"></i> Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => paginate('next')} 
                        disabled={currentPage >= totalPages}
                        className="pagination-button next-button"
                    >
                        Next <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MoneyExchangeApp;