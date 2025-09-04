import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./allevents.css";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

const nepaliMonths = [
    "All", "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra",
    "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export default function ChadParbaList() {
    const [events, setEvents] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [month, setMonth] = useState("All");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get("http://localhost:8800/api/chadparba");
                setEvents(res.data);
                setFiltered(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;

        if (month !== "All") {
            result = result.filter(e => e.nepaliMonth === month);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query) ||
                e.category.toLowerCase().includes(query)
            );
        }

        // Sort alphabetically by title
        result.sort((a, b) => a.title.localeCompare(b.title));
        
        setFiltered(result);
    }, [month, events, searchQuery]);

    return (
        <>
            <Navbar />
            <Header />
            <div className="chadparba-container">
                <div className="header-section">
                    <h1>Nepali Festivals & Events</h1>
                    <p>Discover the rich cultural heritage of Nepal</p>
                </div>

                <div className="controls-container">
                    <div className="search-filter">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>

                        <div className="filter-group">
                            <label>Filter by Month:</label>
                            <div className="custom-select">
                                <select value={month} onChange={e => setMonth(e.target.value)}>
                                    {nepaliMonths.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <div className="select-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading events...</p>
                    </div>
                ) : (
                    <>
                        {filtered.length === 0 ? (
                            <div className="no-events">
                                <div className="empty-state">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12" y2="17" />
                                    </svg>
                                    <h3>No events found</h3>
                                    <p>Try adjusting your search or filter criteria</p>
                                    <button onClick={() => { setMonth("All"); setSearchQuery(""); }}>
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {filtered.map(event => (
                                    <div className="event-card" key={event._id}>
                                        <div className="card-header">
                                            <div className="date-badge">
                                                <span className="month">{event.nepaliMonth}</span>
                                                <span className="day">{event.nepaliDay}</span>
                                            </div>
                                            <div className="category-tag">{event.category}</div>
                                        </div>
                                        <div className="card-content">
                                            <h3>{event.title}</h3>
                                            <p>{event.description.slice(0, 80)}...</p>
                                        </div>
                                        <div className="card-footer">
                                            <Link to={`/events/${event._id}`} className="read-more-link">
                                                <span>Read More</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M5 12h14" />
                                                    <path d="M12 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}