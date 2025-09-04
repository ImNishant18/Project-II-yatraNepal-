import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./trips.css"; // Import the CSS

export default function Trips() {
    return (
        <div>
            <Navbar />
            <Header />
            <div className="trips-container">
                <h1 className="trips-heading">This page is under creation</h1>
                <p className="trips-subtext">We're working hard to bring this feature to you soon!</p>
            </div>
            <Footer />
        </div>
    );
}