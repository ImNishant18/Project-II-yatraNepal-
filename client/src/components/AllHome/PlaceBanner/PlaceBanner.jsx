import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./place_banner.css";

export default function PlaceBanner() {
    const containerRef = useRef(null);
    const [destinations, setDestinations] = useState([]);
    const cardWidth = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8800/api/place")
            .then((res) => res.json())
            .then((data) => {
                console.log("API response:", data);

                const placesArray = data.data; // <-- your array is here
                if (!Array.isArray(placesArray)) {
                    throw new Error("API response does not contain an array of places");
                }

                // Clone last 3 and first 3 for infinite scroll effect
                const cloneStart = placesArray.slice(-3);
                const cloneEnd = placesArray.slice(0, 3);

                setDestinations([...cloneStart, ...placesArray, ...cloneEnd]);

                // Initialize scroll position after rendering cards
                setTimeout(() => {
                    if (containerRef.current) {
                        const container = containerRef.current;
                        const firstCard = container.children[3];
                        if (firstCard) {
                            cardWidth.current = firstCard.offsetWidth;
                            container.scrollLeft = 0;
                        }
                    }
                }, 100);
            })
            .catch((err) => {
                console.error("Failed to fetch places:", err);
            });
    }, []);

    const handleScroll = () => {
        const container = containerRef.current;
        const scrollLeft = container.scrollLeft;
        const totalCards = destinations.length;
        const firstRealIndex = 3;
        const lastRealIndex = totalCards - 3;

        if (scrollLeft >= container.children[lastRealIndex].offsetLeft) {
            container.scrollLeft = container.children[firstRealIndex].offsetLeft;
        }

        if (scrollLeft <= container.children[0].offsetLeft) {
            container.scrollLeft = container.children[lastRealIndex - 1].offsetLeft;
        }
    };

    const scrollByCards = (count) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: count * cardWidth.current,
                behavior: "smooth",
            });
        }
    };

    const handleExploreClick = (id) => {
        navigate(`/placedetails/${id}`);
    };

    return (
        <div className="place-container">
            <h1 className="place-title">Top destinations for your next vacation</h1>

            <div className="carousel-container">
                <button className="nav-button prev-button" onClick={() => scrollByCards(-1)}>
                    <ChevronLeft className="nav-icon" />
                </button>

                <div className="carousel" ref={containerRef} onScroll={handleScroll}>
                    {destinations.map((destination, index) => (
                        <div key={`${destination._id}-${index}`} className="card">
                            <img
                                src={destination.img}
                                alt={destination.name}
                                className="card-image"
                            />
                            <div className="card-overlay">
                                <div className="card-title">{destination.name}</div>
                                <button
                                    className="place-explore-button"
                                    onClick={() => handleExploreClick(destination._id)}
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="nav-button next-button" onClick={() => scrollByCards(1)}>
                    <ChevronRight className="nav-icon" />
                </button>
            </div>
        </div>
    );
}
