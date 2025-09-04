import React from "react";
import { useNavigate } from "react-router-dom";
import "./banner.css";

const bannerData = [
    {
        id: "1",
        image: "/images/1.jpg",
        sponsor: "Explore Nepals history and culture with us! and hidden gems of Nepalese Territory",
        title: "Discover Nepal History",
        description: "Find out why travelers like you are raving about Nepal",
    },
    {
        id: "2",
        image: "/images/2.jpg",
        sponsor: "Explore and Visit the waterfall and lakes of Nepal",
        title: "Discover Nepal Waterfalls",
        description: "Find out why travelers like you are raving about Nepal",
    },
];

function TravelBanner() {
    const navigate = useNavigate();

    const handleExploreClick = (title) => {
        console.log(`Exploring ${title}`);
        navigate("/places");
    };

    return (
        <div className="banner-container">
            {bannerData.map((banner) => (
                <div key={banner.id} className="banner-card">
                    <div className="banner-image">
                        <img src={banner.image} alt={banner.title} />
                    </div>

                    <div className="banner-content">
                        <div className="sponsor-text">{banner.sponsor}</div>
                        <h2 className="banner-title">{banner.title}</h2>
                        <p className="banner-description">{banner.description}</p>
                    </div>

                    <div className="banner-action">
                        <button
                            className="explore-button"
                            onClick={() => handleExploreClick(banner.title)}
                        >
                            Explore now
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TravelBanner;
