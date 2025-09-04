import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import "./touristguide.css";

const TouristGuide = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setLoading(false);
    }, []);

    const handleContinueAsUser = () => {
        navigate("/user-dashboard");
    };

    const handleContinueAsGuide = () => {
        if (!user) return;

        if (user.role === "user") {
            navigate("/create-tourist-guide");
        } else if (user.role === "tourist guide") {
            navigate("/touristguide-dashboard");
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Navbar />
            <Header />
            <div className="tourist-guide-container">
                <div className="tourist-guide-card">
                    <h2>Welcome, {user.username}!</h2>
                    <p>How would you like to proceed?</p>
                    
                    <div className="guide-options">
                        <button 
                            className="option-btn user-option"
                            onClick={handleContinueAsUser}
                        >
                            Continue as Regular User
                        </button>
                        
                        <button 
                            className="option-btn guide-option"
                            onClick={handleContinueAsGuide}
                        >
                            Continue as Tourist Guide
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TouristGuide;