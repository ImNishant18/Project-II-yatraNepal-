"use client"
import React from "react"
import { useState, useEffect } from "react"
import {
    FaPlane,
    FaUsers,
    FaCalendarAlt,
    FaSearch,
    FaFilter,
    FaCoffee,
    FaUtensils,
    FaMountain,
    FaWifi,
    FaTachometerAlt,
    FaCreditCard,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaLuggageCart,
    FaCheckCircle,
    FaTimes,
    FaInfoCircle,
    FaGlobe,
    FaShieldAlt,
    FaPrint,
    FaDownload,
} from "react-icons/fa"
import { MdFlightTakeoff, MdFlightLand, MdAirplanemodeActive, MdLocationOn } from "react-icons/md"
import { IoAirplane } from "react-icons/io5"
import "./flights.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"

// Enhanced Nepal Airlines and Flight Data with more details
const nepalFlights = [
    {
        id: "RA101",
        airline: "Nepal Airlines",
        from: "KTM",
        to: "PKR",
        departure: "08:30",
        arrival: "09:15",
        duration: "45 min",
        status: "On Time",
        aircraft: "ATR 72",
        altitude: "12,000 ft",
        speed: "280 mph",
        progress: 75,
        price: 8500,
        gate: "A3",
        terminal: "Domestic",
        baggage: "20kg",
        meal: "Light Breakfast",
        wifi: true,
        entertainment: false,
        seats: {
            economy: { available: 45, total: 72 },
            business: { available: 0, total: 0 },
        },
        route: "Direct",
        distance: "200 km",
        co2: "45 kg",
        onTimePerformance: "92%",
    },
    {
        id: "U4505",
        airline: "Buddha Air",
        from: "KTM",
        to: "BWA",
        departure: "10:45",
        arrival: "11:30",
        duration: "45 min",
        status: "Delayed",
        aircraft: "Beechcraft 1900D",
        altitude: "15,000 ft",
        speed: "250 mph",
        progress: 30,
        price: 12500,
        gate: "B2",
        terminal: "Domestic",
        baggage: "15kg",
        meal: "Snacks",
        wifi: false,
        entertainment: false,
        seats: {
            economy: { available: 12, total: 19 },
            business: { available: 0, total: 0 },
        },
        route: "Direct",
        distance: "180 km",
        co2: "38 kg",
        onTimePerformance: "88%",
    },
    {
        id: "YT691",
        airline: "Yeti Airlines",
        from: "PKR",
        to: "JKR",
        departure: "14:20",
        arrival: "15:05",
        duration: "45 min",
        status: "In Flight",
        aircraft: "DHC-6 Twin Otter",
        altitude: "18,000 ft",
        speed: "180 mph",
        progress: 60,
        price: 15800,
        gate: "C1",
        terminal: "Domestic",
        baggage: "10kg",
        meal: "None",
        wifi: false,
        entertainment: false,
        seats: {
            economy: { available: 8, total: 19 },
            business: { available: 0, total: 0 },
        },
        route: "Direct",
        distance: "150 km",
        co2: "32 kg",
        onTimePerformance: "85%",
    },
    {
        id: "SH401",
        airline: "Shree Airlines",
        from: "KTM",
        to: "BHR",
        departure: "16:15",
        arrival: "17:00",
        duration: "45 min",
        status: "Boarding",
        aircraft: "Jetstream 41",
        altitude: "0 ft",
        speed: "0 mph",
        progress: 0,
        price: 9200,
        gate: "A1",
        terminal: "Domestic",
        baggage: "20kg",
        meal: "Light Snacks",
        wifi: true,
        entertainment: true,
        seats: {
            economy: { available: 25, total: 29 },
            business: { available: 0, total: 0 },
        },
        route: "Direct",
        distance: "160 km",
        co2: "35 kg",
        onTimePerformance: "90%",
    },
    {
        id: "RA201",
        airline: "Nepal Airlines",
        from: "KTM",
        to: "DEL",
        departure: "11:30",
        arrival: "13:15",
        duration: "1h 45m",
        status: "On Time",
        aircraft: "Airbus A320",
        altitude: "35,000 ft",
        speed: "520 mph",
        progress: 85,
        price: 25000,
        gate: "I5",
        terminal: "International",
        baggage: "30kg",
        meal: "Full Meal",
        wifi: true,
        entertainment: true,
        seats: {
            economy: { available: 120, total: 150 },
            business: { available: 8, total: 12 },
        },
        route: "Direct",
        distance: "650 km",
        co2: "180 kg",
        onTimePerformance: "94%",
    },
    {
        id: "U4201",
        airline: "Buddha Air",
        from: "KTM",
        to: "LUK",
        departure: "06:00",
        arrival: "06:30",
        duration: "30 min",
        status: "In Flight",
        aircraft: "Dornier 228",
        altitude: "16,000 ft",
        speed: "200 mph",
        progress: 90,
        price: 18500,
        gate: "A4",
        terminal: "Domestic",
        baggage: "10kg",
        meal: "None",
        wifi: false,
        entertainment: false,
        seats: {
            economy: { available: 2, total: 19 },
            business: { available: 0, total: 0 },
        },
        route: "Direct",
        distance: "140 km",
        co2: "28 kg",
        onTimePerformance: "78%",
    },
]

// Nepal Airports with more details
const nepalAirports = [
    {
        code: "KTM",
        name: "Tribhuvan International Airport",
        city: "Kathmandu",
        country: "Nepal",
        timezone: "NPT (UTC+5:45)",
        elevation: "1,338 m",
    },
    {
        code: "PKR",
        name: "Pokhara Regional Airport",
        city: "Pokhara",
        country: "Nepal",
        timezone: "NPT (UTC+5:45)",
        elevation: "827 m",
    },
    {
        code: "BWA",
        name: "Bhairahawa Airport",
        city: "Bhairahawa",
        country: "Nepal",
        timezone: "NPT (UTC+5:45)",
        elevation: "109 m",
    },
    {
        code: "JKR",
        name: "Janakpur Airport",
        city: "Janakpur",
        country: "Nepal",
        timezone: "NPT (UTC+5:45)",
        elevation: "74 m",
    },
    {
        code: "BHR",
        name: "Bharatpur Airport",
        city: "Bharatpur",
        country: "Nepal",
        timezone: "NPT (UTC+5:45)",
        elevation: "205 m",
    },
    {
        code: "LUK",
        name: "Lukla Airport",
        city: "Lukla",
        country: "Nepal",
        timezone: "NPT (UTC+5:45)",
        elevation: "2,845 m",
    },
    {
        code: "JMO",
        name: "Jomsom Airport",
        city: "Jomsom",
        country: "Nepal",
        timezone: "NPT (UTC+5:45)",
        elevation: "2,682 m",
    },
    {
        code: "DEL",
        name: "Indira Gandhi International",
        city: "New Delhi",
        country: "India",
        timezone: "IST (UTC+5:30)",
        elevation: "237 m",
    },
]

// Popular destinations in Nepal
const popularDestinations = [
    {
        city: "Pokhara",
        price: 8500,
        description: "Lake City & Adventure Hub",
        image: "https://thumbs.dreamstime.com/b/bright-row-boats-lake-phewa-pokhara-nepal-colorful-docked-78712498.jpg",
        attractions: ["Phewa Lake", "Sarangkot", "Peace Pagoda"],
        weather: "Pleasant, 18-25°C",
    },
    {
        city: "Lukla",
        price: 18500,
        description: "Gateway to Everest",
        image: "https://media.nepaltrekadventures.com/uploads/media/Blog/History%20of%20Lukla%20Airport/Lukla-villag.jpg",
        attractions: ["Everest Base Camp Trek", "Sherpa Culture", "Mountain Views"],
        weather: "Cold, 5-15°C",
    },
    {
        city: "Jomsom",
        price: 16200,
        description: "Mustang Region",
        image: "https://media.nepaltrekadventures.com/uploads/img/jomsom-banner.webp",
        attractions: ["Upper Mustang", "Muktinath Temple", "Apple Orchards"],
        weather: "Dry, 10-20°C",
    },
    {
        city: "Bharatpur",
        price: 9200,
        description: "Chitwan National Park",
        image: "https://www.footprintadventure.com/uploads/media/Chitwan%20National%20Park/crocodile%20in%20sauraha%20chitwan.jpg",
        attractions: ["Wildlife Safari", "Elephant Rides", "Jungle Activities"],
        weather: "Tropical, 20-30°C",
    },
]

const NepalFlightTracker = () => {
    const [activeTab, setActiveTab] = useState("tracker")
    const [flights, setFlights] = useState(nepalFlights)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [departureDate, setDepartureDate] = useState("")
    const [returnDate, setReturnDate] = useState("")
    const [fromAirport, setFromAirport] = useState("")
    const [toAirport, setToAirport] = useState("")
    const [passengers, setPassengers] = useState("1")
    const [tripType, setTripType] = useState("round-trip")
    const [searchResults, setSearchResults] = useState([])
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [selectedFlight, setSelectedFlight] = useState(null)
    const [showFlightDetails, setShowFlightDetails] = useState(false)
    const [showBookingForm, setShowBookingForm] = useState(false)
    const [bookingStep, setBookingStep] = useState(1)
    const [bookingData, setBookingData] = useState({
        passengers: [],
        contactInfo: {
            email: "",
            phone: "",
            address: "",
            emergencyContact: "",
        },
        paymentInfo: {
            method: "card",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            cardName: "",
        },
        additionalServices: {
            extraBaggage: false,
            seatSelection: false,
            meal: false,
            insurance: false,
        },
    })
    const [bookingConfirmation, setBookingConfirmation] = useState(null)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setFlights((prevFlights) =>
                prevFlights.map((flight) => ({
                    ...flight,
                    progress: Math.min(100, flight.progress + Math.random() * 2),
                    speed: flight.status === "In Flight" ? Math.floor(150 + Math.random() * 100) + " mph" : flight.speed,
                })),
            )
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const filteredFlights = flights.filter((flight) => {
        const matchesSearch =
            flight.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.to.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || flight.status.toLowerCase().replace(" ", "-") === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status) => {
        switch (status) {
            case "On Time":
                return "flight-status-on-time"
            case "Delayed":
                return "flight-status-delayed"
            case "Boarding":
                return "flight-status-boarding"
            case "In Flight":
                return "flight-status-in-flight"
            default:
                return "flight-status-default"
        }
    }

    const formatNPR = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "NPR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const handleFlightDetails = (flight) => {
        setSelectedFlight(flight)
        setShowFlightDetails(true)
    }

    const handleBookFlight = (flight) => {
        setSelectedFlight(flight)
        setShowBookingForm(true)
        setBookingStep(1)

        // Initialize passenger data based on selected number of passengers
        const passengerCount = Number.parseInt(passengers)
        const initialPassengers = Array.from({ length: passengerCount }, (_, index) => ({
            id: index + 1,
            title: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            nationality: "Nepali",
            passportNumber: "",
            passportExpiry: "",
            specialRequests: "",
        }))

        setBookingData((prev) => ({
            ...prev,
            passengers: initialPassengers,
        }))
    }

    const handleSearch = () => {
        if (!fromAirport || !toAirport || !departureDate) {
            alert("Please fill in all required fields")
            return
        }

        setIsSearching(true)

        setTimeout(() => {
            const results = nepalFlights.filter((flight) => {
                const matchesRoute = flight.from === fromAirport && flight.to === toAirport
                return matchesRoute
            })

            if (results.length === 0) {
                const alternativeFlights = nepalFlights.filter(
                    (flight) => flight.from === fromAirport || flight.to === toAirport,
                )
                setSearchResults(alternativeFlights)
            } else {
                setSearchResults(results)
            }

            setIsSearchMode(true)
            setIsSearching(false)
            setActiveTab("tracker")
        }, 1000)
    }

    const clearSearch = () => {
        setIsSearchMode(false)
        setSearchResults([])
        setFromAirport("")
        setToAirport("")
        setDepartureDate("")
        setReturnDate("")
        setPassengers("1")
    }

    const handleBookingSubmit = () => {
        // Generate booking confirmation
        const confirmationNumber = "NP" + Math.random().toString(36).substr(2, 9).toUpperCase()
        const totalPrice = selectedFlight.price * Number.parseInt(passengers)

        setBookingConfirmation({
            confirmationNumber,
            flight: selectedFlight,
            passengers: bookingData.passengers,
            contactInfo: bookingData.contactInfo,
            totalPrice,
            bookingDate: new Date().toISOString(),
            status: "Confirmed",
        })

        setShowBookingForm(false)
        setActiveTab("confirmation")
    }

    const nextBookingStep = () => {
        setBookingStep((prev) => Math.min(prev + 1, 4))
    }

    const prevBookingStep = () => {
        setBookingStep((prev) => Math.max(prev - 1, 1))
    }

    return (
        <div className="flight-pgs">
            <Navbar />
            <Header />
            <div className="flight-container">
                {/* Header */}
                <header className="flight-header">
                    <div className="flight-header-content">
                        <div className="flight-header-left">
                            <div className="flight-logo">
                                
                                <FaPlane className="flight-logo-plane" />
                            </div>
                            <div className="flight-title-section">
                                <h1 className="flight-main-title">yatraNepal</h1>
                                <p className="flight-subtitle">Flight Tracking & Booking System</p>
                            </div>
                        </div>
                        <nav className="flight-nav">
                            <button
                                onClick={() => setActiveTab("tracker")}
                                className={`flight-nav-button ${activeTab === "tracker" ? "flight-nav-active" : ""}`}
                            >
                                <MdAirplanemodeActive className="flight-nav-icon" />
                                <span>Flight Tracker</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("booking")}
                                className={`flight-nav-button ${activeTab === "booking" ? "flight-nav-active" : ""}`}
                            >
                                <FaCalendarAlt className="flight-nav-icon" />
                                <span>Book Flight</span>
                            </button>
                            {bookingConfirmation && (
                                <button
                                    onClick={() => setActiveTab("confirmation")}
                                    className={`flight-nav-button ${activeTab === "confirmation" ? "flight-nav-active" : ""}`}
                                >
                                    <FaCheckCircle className="flight-nav-icon" />
                                    <span>My Booking</span>
                                </button>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flight-main">
                    {activeTab === "tracker" && (
                        <div className="flight-tracker-section">
                            {/* Search and Filter Controls */}
                            <div className="flight-card flight-search-card">
                                <div className="flight-card-header">
                                    <h3 className="flight-card-title">
                                        <FaSearch className="flight-card-icon" />
                                        <span>Flight Search & Filter</span>
                                    </h3>
                                </div>
                                <div className="flight-card-content">
                                    <div className="flight-search-controls">
                                        <div className="flight-search-input-container">
                                            <input
                                                type="text"
                                                placeholder="Search by flight number, airline, or airport..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="flight-search-input"
                                            />
                                        </div>
                                        <div className="flight-filter-container">
                                            <FaFilter className="flight-filter-icon" />
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="flight-filter-select"
                                            >
                                                <option value="all">All Status</option>
                                                <option value="on-time">On Time</option>
                                                <option value="delayed">Delayed</option>
                                                <option value="boarding">Boarding</option>
                                                <option value="in-flight">In Flight</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Flight Tracker */}
                            <div className="flight-tracker-content">
                                <h2 className="flight-section-title">
                                    <IoAirplane className="flight-section-icon" />
                                    <span>Live Flight Tracker</span>
                                    <span className="flight-count-badge">{filteredFlights.length} flights</span>
                                </h2>

                                {/* Search Results or All Flights */}
                                <div className="flight-list">
                                    {isSearchMode && (
                                        <div className="flight-search-results-header">
                                            <div className="flight-search-results-info">
                                                <h3>Search Results</h3>
                                                <p>{searchResults.length} flights found</p>
                                                {fromAirport && toAirport && (
                                                    <p>
                                                        From {nepalAirports.find((a) => a.code === fromAirport)?.city} to{" "}
                                                        {nepalAirports.find((a) => a.code === toAirport)?.city}
                                                    </p>
                                                )}
                                            </div>
                                            <button onClick={clearSearch} className="flight-clear-search-button">
                                                <span>Clear Search</span>
                                            </button>
                                        </div>
                                    )}

                                    {isSearching ? (
                                        <div className="flight-loading">
                                            <FaPlane className="flight-loading-icon" />
                                            <p>Searching flights...</p>
                                        </div>
                                    ) : (
                                        (isSearchMode ? searchResults : filteredFlights).map((flight) => {
                                            const fromAirportData = nepalAirports.find((a) => a.code === flight.from)
                                            const toAirportData = nepalAirports.find((a) => a.code === flight.to)

                                            return (
                                                <div key={flight.id} className="flight-card flight-item">
                                                    <div className="flight-card-content">
                                                        <div className="flight-info-container">
                                                            <div className="flight-header-info">
                                                                <div className="flight-id-status">
                                                                    <h3 className="flight-id">{flight.id}</h3>
                                                                    <span className={`flight-status-badge ${getStatusColor(flight.status)}`}>
                                                                        {flight.status}
                                                                    </span>
                                                                    <span className="flight-gate-info">Gate {flight.gate}</span>
                                                                </div>
                                                                <div className="flight-airline-info">
                                                                    <p className="flight-airline">{flight.airline}</p>
                                                                    <p className="flight-aircraft">{flight.aircraft}</p>
                                                                    <p className="flight-duration">{flight.duration}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flight-details-grid">
                                                                {/* Route */}
                                                                <div className="flight-route-container">
                                                                    <div className="flight-departure">
                                                                        <div className="flight-airport-icon">
                                                                            <MdFlightTakeoff className="flight-takeoff-icon" />
                                                                        </div>
                                                                        <p className="flight-airport-code">{flight.from}</p>
                                                                        <p className="flight-city-name">{fromAirportData?.city}</p>
                                                                        <p className="flight-time">{flight.departure}</p>
                                                                        <p className="flight-terminal">Terminal: {flight.terminal}</p>
                                                                    </div>
                                                                    <div className="flight-progress-container">
                                                                        <div className="flight-progress-bar">
                                                                            <div
                                                                                className="flight-progress-fill"
                                                                                style={{ width: `${flight.progress}%` }}
                                                                            ></div>
                                                                            <FaPlane
                                                                                className="flight-progress-plane"
                                                                                style={{ left: `${Math.max(0, flight.progress - 2)}%` }}
                                                                            />
                                                                        </div>
                                                                        <div className="flight-progress-text">
                                                                            <span>{Math.round(flight.progress)}% Complete</span>
                                                                        </div>
                                                                        <div className="flight-route-info">
                                                                            <span>
                                                                                {flight.distance} • {flight.route}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flight-arrival">
                                                                        <div className="flight-airport-icon">
                                                                            <MdFlightLand className="flight-landing-icon" />
                                                                        </div>
                                                                        <p className="flight-airport-code">{flight.to}</p>
                                                                        <p className="flight-city-name">{toAirportData?.city}</p>
                                                                        <p className="flight-time">{flight.arrival}</p>
                                                                        <p className="flight-terminal">Terminal: {flight.terminal}</p>
                                                                    </div>
                                                                </div>

                                                                {/* Flight Details */}
                                                                <div className="flight-stats">
                                                                    <div className="flight-stat-item">
                                                                        <FaMountain className="flight-stat-icon" />
                                                                        <span>Altitude: {flight.altitude}</span>
                                                                    </div>
                                                                    <div className="flight-stat-item">
                                                                        <FaTachometerAlt className="flight-stat-icon" />
                                                                        <span>Speed: {flight.speed}</span>
                                                                    </div>
                                                                    <div className="flight-stat-item">
                                                                        <FaLuggageCart className="flight-stat-icon" />
                                                                        <span>Baggage: {flight.baggage}</span>
                                                                    </div>
                                                                    <div className="flight-stat-item">
                                                                        <FaUtensils className="flight-stat-icon" />
                                                                        <span>Meal: {flight.meal}</span>
                                                                    </div>
                                                                    <div className="flight-amenities">
                                                                        {flight.wifi && <FaWifi className="flight-amenity-icon" title="WiFi Available" />}
                                                                        {flight.entertainment && (
                                                                            <FaGlobe className="flight-amenity-icon" title="Entertainment" />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Booking */}
                                                                <div className="flight-booking-section">
                                                                    <div className="flight-price-container">
                                                                        <p className="flight-price">{formatNPR(flight.price)}</p>
                                                                        <p className="flight-price-label">per person</p>
                                                                        <p className="flight-seats-info">{flight.seats.economy.available} seats left</p>
                                                                    </div>
                                                                    <div className="flight-action-buttons">
                                                                        <button onClick={() => handleFlightDetails(flight)} className="flight-details-button">
                                                                            <FaInfoCircle className="flight-button-icon" />
                                                                            <span>Details</span>
                                                                        </button>
                                                                        <button onClick={() => handleBookFlight(flight)} className="flight-book-button">
                                                                            <FaCalendarAlt className="flight-book-icon" />
                                                                            <span>Book Now</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}

                                    {isSearchMode && searchResults.length === 0 && !isSearching && (
                                        <div className="flight-no-results">
                                            <FaPlane className="flight-no-results-icon" />
                                            <h3>No flights found</h3>
                                            <p>Try searching for different airports or dates</p>
                                            <button onClick={clearSearch} className="flight-try-again-button">
                                                Try Different Search
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "booking" && (
                        <div className="flight-booking-section">
                            <div className="flight-booking-header">
                                <h2 className="flight-booking-title">
                                    <FaPlane className="flight-booking-title-icon" />
                                    <span>Book Your Flight</span>
                                </h2>
                                <p className="flight-booking-subtitle">Find and book flights across Nepal</p>
                            </div>

                            <div className="flight-booking-grid">
                                {/* Booking Form */}
                                <div className="flight-booking-form-container">
                                    <div className="flight-card flight-booking-form">
                                        <div className="flight-card-header">
                                            <h3 className="flight-card-title">
                                                <FaSearch className="flight-card-icon" />
                                                <span>Flight Search</span>
                                            </h3>
                                        </div>
                                        <div className="flight-card-content">
                                            {/* Trip Type */}
                                            <div className="flight-trip-type">
                                                <label className="flight-radio-label">
                                                    <input
                                                        type="radio"
                                                        value="round-trip"
                                                        checked={tripType === "round-trip"}
                                                        onChange={(e) => setTripType(e.target.value)}
                                                        className="flight-radio-input"
                                                    />
                                                    <span>Round Trip</span>
                                                </label>
                                                <label className="flight-radio-label">
                                                    <input
                                                        type="radio"
                                                        value="one-way"
                                                        checked={tripType === "one-way"}
                                                        onChange={(e) => setTripType(e.target.value)}
                                                        className="flight-radio-input"
                                                    />
                                                    <span>One Way</span>
                                                </label>
                                            </div>

                                            {/* From/To */}
                                            <div className="flight-airports-grid">
                                                <div className="flight-form-group">
                                                    <label className="flight-form-label">
                                                        <MdFlightTakeoff className="flight-form-icon" />
                                                        <span>From</span>
                                                    </label>
                                                    <select
                                                        value={fromAirport}
                                                        onChange={(e) => setFromAirport(e.target.value)}
                                                        className="flight-form-select"
                                                    >
                                                        <option value="">Select departure airport</option>
                                                        {nepalAirports.map((airport) => (
                                                            <option key={airport.code} value={airport.code}>
                                                                {airport.code} - {airport.city}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flight-form-group">
                                                    <label className="flight-form-label">
                                                        <MdFlightLand className="flight-form-icon" />
                                                        <span>To</span>
                                                    </label>
                                                    <select
                                                        value={toAirport}
                                                        onChange={(e) => setToAirport(e.target.value)}
                                                        className="flight-form-select"
                                                    >
                                                        <option value="">Select destination airport</option>
                                                        {nepalAirports.map((airport) => (
                                                            <option key={airport.code} value={airport.code}>
                                                                {airport.code} - {airport.city}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div className="flight-dates-grid">
                                                <div className="flight-form-group">
                                                    <label className="flight-form-label">
                                                        <FaCalendarAlt className="flight-form-icon" />
                                                        <span>Departure Date</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={departureDate}
                                                        onChange={(e) => setDepartureDate(e.target.value)}
                                                        className="flight-form-input"
                                                    />
                                                </div>
                                                {tripType === "round-trip" && (
                                                    <div className="flight-form-group">
                                                        <label className="flight-form-label">
                                                            <FaCalendarAlt className="flight-form-icon" />
                                                            <span>Return Date</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={returnDate}
                                                            onChange={(e) => setReturnDate(e.target.value)}
                                                            className="flight-form-input"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Passengers */}
                                            <div className="flight-form-group">
                                                <label className="flight-form-label">
                                                    <FaUsers className="flight-form-icon" />
                                                    <span>Passengers</span>
                                                </label>
                                                <select
                                                    value={passengers}
                                                    onChange={(e) => setPassengers(e.target.value)}
                                                    className="flight-form-select"
                                                >
                                                    <option value="1">1 Passenger</option>
                                                    <option value="2">2 Passengers</option>
                                                    <option value="3">3 Passengers</option>
                                                    <option value="4">4 Passengers</option>
                                                    <option value="5">5+ Passengers</option>
                                                </select>
                                            </div>

                                            <button onClick={handleSearch} className="flight-search-button" disabled={isSearching}>
                                                <FaSearch className="flight-search-button-icon" />
                                                <span>{isSearching ? "Searching..." : "Search Flights"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="flight-sidebar">
                                    {/* Popular Destinations */}
                                    <div className="flight-card flight-destinations-card">
                                        <div className="flight-card-header">
                                            <h3 className="flight-card-title">
                                                <FaMountain className="flight-card-icon" />
                                                <span>Popular Destinations</span>
                                            </h3>
                                        </div>
                                        <div className="flight-card-content">
                                            {popularDestinations.map((dest, index) => (
                                                <div key={index} className="flight-destination-item">
                                                    <img
                                                        src={dest.image || "/placeholder.svg"}
                                                        alt={dest.city}
                                                        className="flight-destination-image"
                                                    />
                                                    <div className="flight-destination-info">
                                                        <div className="flight-destination-name">
                                                            <MdLocationOn className="flight-destination-icon" />
                                                            <p className="flight-destination-city">{dest.city}</p>
                                                        </div>
                                                        <p className="flight-destination-description">{dest.description}</p>
                                                        <p className="flight-destination-weather">{dest.weather}</p>
                                                        <p className="flight-destination-price">From {formatNPR(dest.price)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Airlines Info */}
                                    <div className="flight-card flight-airlines-card">
                                        <div className="flight-card-header">
                                            <h3 className="flight-card-title">
                                                <IoAirplane className="flight-card-icon" />
                                                <span>Nepal Airlines</span>
                                            </h3>
                                        </div>
                                        <div className="flight-card-content">
                                            <div className="flight-airlines-list">
                                                <div className="flight-airline-item">
                                                    <div className="flight-airline-dot flight-airline-dot-blue"></div>
                                                    <span>Nepal Airlines (National Flag Carrier)</span>
                                                </div>
                                                <div className="flight-airline-item">
                                                    <div className="flight-airline-dot flight-airline-dot-green"></div>
                                                    <span>Buddha Air</span>
                                                </div>
                                                <div className="flight-airline-item">
                                                    <div className="flight-airline-dot flight-airline-dot-purple"></div>
                                                    <span>Yeti Airlines</span>
                                                </div>
                                                <div className="flight-airline-item">
                                                    <div className="flight-airline-dot flight-airline-dot-orange"></div>
                                                    <span>Shree Airlines</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flight-card flight-amenities-card">
                                        <div className="flight-card-header">
                                            <h3 className="flight-card-title">
                                                <FaCoffee className="flight-card-icon" />
                                                <span>Flight Services</span>
                                            </h3>
                                        </div>
                                        <div className="flight-card-content">
                                            <div className="flight-amenities-list">
                                                <div className="flight-amenity-item">
                                                    <FaMountain className="flight-amenity-icon flight-amenity-icon-blue" />
                                                    <span>Mountain Views</span>
                                                </div>
                                                <div className="flight-amenity-item">
                                                    <FaUtensils className="flight-amenity-icon flight-amenity-icon-green" />
                                                    <span>Nepali Meals</span>
                                                </div>
                                                <div className="flight-amenity-item">
                                                    <FaCoffee className="flight-amenity-icon flight-amenity-icon-orange" />
                                                    <span>Tea Service</span>
                                                </div>
                                                <div className="flight-amenity-item">
                                                    <FaUsers className="flight-amenity-icon flight-amenity-icon-purple" />
                                                    <span>Friendly Crew</span>
                                                </div>
                                                <div className="flight-amenity-item">
                                                    <FaWifi className="flight-amenity-icon flight-amenity-icon-blue" />
                                                    <span>WiFi Available</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "confirmation" && bookingConfirmation && (
                        <div className="flight-confirmation-section">
                            <div className="flight-confirmation-header">
                                <FaCheckCircle className="flight-confirmation-icon" />
                                <h2>Booking Confirmed!</h2>
                                <p>Your flight has been successfully booked</p>
                            </div>

                            <div className="flight-confirmation-content">
                                <div className="flight-confirmation-details">
                                    <div className="flight-card">
                                        <div className="flight-card-header">
                                            <h3 className="flight-card-title">
                                                <FaPlane className="flight-card-icon" />
                                                <span>Booking Details</span>
                                            </h3>
                                        </div>
                                        <div className="flight-card-content">
                                            <div className="flight-confirmation-info">
                                                <div className="flight-confirmation-row">
                                                    <span className="flight-confirmation-label">Confirmation Number:</span>
                                                    <span className="flight-confirmation-value">{bookingConfirmation.confirmationNumber}</span>
                                                </div>
                                                <div className="flight-confirmation-row">
                                                    <span className="flight-confirmation-label">Flight:</span>
                                                    <span className="flight-confirmation-value">{bookingConfirmation.flight.id}</span>
                                                </div>
                                                <div className="flight-confirmation-row">
                                                    <span className="flight-confirmation-label">Route:</span>
                                                    <span className="flight-confirmation-value">
                                                        {bookingConfirmation.flight.from} → {bookingConfirmation.flight.to}
                                                    </span>
                                                </div>
                                                <div className="flight-confirmation-row">
                                                    <span className="flight-confirmation-label">Date:</span>
                                                    <span className="flight-confirmation-value">{departureDate}</span>
                                                </div>
                                                <div className="flight-confirmation-row">
                                                    <span className="flight-confirmation-label">Passengers:</span>
                                                    <span className="flight-confirmation-value">{bookingConfirmation.passengers.length}</span>
                                                </div>
                                                <div className="flight-confirmation-row">
                                                    <span className="flight-confirmation-label">Total Amount:</span>
                                                    <span className="flight-confirmation-value flight-confirmation-price">
                                                        {formatNPR(bookingConfirmation.totalPrice)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flight-confirmation-actions">
                                                <button className="flight-confirmation-button">
                                                    <FaPrint className="flight-button-icon" />
                                                    <span>Print Ticket</span>
                                                </button>
                                                <button className="flight-confirmation-button">
                                                    <FaDownload className="flight-button-icon" />
                                                    <span>Download PDF</span>
                                                </button>
                                                <button className="flight-confirmation-button">
                                                    <FaEnvelope className="flight-button-icon" />
                                                    <span>Email Ticket</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Flight Details Modal */}
                {showFlightDetails && selectedFlight && (
                    <div className="flight-modal-overlay" onClick={() => setShowFlightDetails(false)}>
                        <div className="flight-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="flight-modal-header">
                                <h3>Flight Details - {selectedFlight.id}</h3>
                                <button className="flight-modal-close" onClick={() => setShowFlightDetails(false)}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="flight-modal-content">
                                <div className="flight-details-grid">
                                    <div className="flight-details-section">
                                        <h4>
                                            <FaPlane className="flight-details-icon" /> Flight Information
                                        </h4>
                                        <div className="flight-details-list">
                                            <div className="flight-detail-item">
                                                <span>Airline:</span>
                                                <span>{selectedFlight.airline}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Aircraft:</span>
                                                <span>{selectedFlight.aircraft}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Duration:</span>
                                                <span>{selectedFlight.duration}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Distance:</span>
                                                <span>{selectedFlight.distance}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>On-time Performance:</span>
                                                <span>{selectedFlight.onTimePerformance}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flight-details-section">
                                        <h4>
                                            <FaMapMarkerAlt className="flight-details-icon" /> Route Details
                                        </h4>
                                        <div className="flight-details-list">
                                            <div className="flight-detail-item">
                                                <span>Departure:</span>
                                                <span>
                                                    {selectedFlight.from} - {selectedFlight.departure}
                                                </span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Arrival:</span>
                                                <span>
                                                    {selectedFlight.to} - {selectedFlight.arrival}
                                                </span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Gate:</span>
                                                <span>{selectedFlight.gate}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Terminal:</span>
                                                <span>{selectedFlight.terminal}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flight-details-section">
                                        <h4>
                                            <FaLuggageCart className="flight-details-icon" /> Services & Amenities
                                        </h4>
                                        <div className="flight-details-list">
                                            <div className="flight-detail-item">
                                                <span>Baggage Allowance:</span>
                                                <span>{selectedFlight.baggage}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Meal Service:</span>
                                                <span>{selectedFlight.meal}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>WiFi:</span>
                                                <span>{selectedFlight.wifi ? "Available" : "Not Available"}</span>
                                            </div>
                                            <div className="flight-detail-item">
                                                <span>Entertainment:</span>
                                                <span>{selectedFlight.entertainment ? "Available" : "Not Available"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flight-details-section">
                                        <h4>
                                            <FaUsers className="flight-details-icon" /> Seat Availability
                                        </h4>
                                        <div className="flight-details-list">
                                            <div className="flight-detail-item">
                                                <span>Economy Class:</span>
                                                <span>
                                                    {selectedFlight.seats.economy.available} / {selectedFlight.seats.economy.total} available
                                                </span>
                                            </div>
                                            {selectedFlight.seats.business.total > 0 && (
                                                <div className="flight-detail-item">
                                                    <span>Business Class:</span>
                                                    <span>
                                                        {selectedFlight.seats.business.available} / {selectedFlight.seats.business.total} available
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flight-modal-actions">
                                    <button
                                        className="flight-book-button"
                                        onClick={() => {
                                            setShowFlightDetails(false)
                                            handleBookFlight(selectedFlight)
                                        }}
                                    >
                                        <FaCalendarAlt className="flight-book-icon" />
                                        <span>Book This Flight</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Form Modal */}
                {showBookingForm && selectedFlight && (
                    <div className="flight-modal-overlay">
                        <div className="flight-booking-modal">
                            <div className="flight-modal-header">
                                <h3>Book Flight {selectedFlight.id}</h3>
                                <button className="flight-modal-close" onClick={() => setShowBookingForm(false)}>
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Booking Steps */}
                            <div className="flight-booking-steps">
                                <div className={`flight-booking-step ${bookingStep >= 1 ? "active" : ""}`}>
                                    <span className="flight-step-number">1</span>
                                    <span>Passengers</span>
                                </div>
                                <div className={`flight-booking-step ${bookingStep >= 2 ? "active" : ""}`}>
                                    <span className="flight-step-number">2</span>
                                    <span>Contact</span>
                                </div>
                                <div className={`flight-booking-step ${bookingStep >= 3 ? "active" : ""}`}>
                                    <span className="flight-step-number">3</span>
                                    <span>Payment</span>
                                </div>
                                <div className={`flight-booking-step ${bookingStep >= 4 ? "active" : ""}`}>
                                    <span className="flight-step-number">4</span>
                                    <span>Review</span>
                                </div>
                            </div>

                            <div className="flight-modal-content">
                                {/* Step 1: Passenger Information */}
                                {bookingStep === 1 && (
                                    <div className="flight-booking-step-content">
                                        <h4>
                                            <FaUser className="flight-details-icon" /> Passenger Information
                                        </h4>
                                        {bookingData.passengers.map((passenger, index) => (
                                            <div key={index} className="flight-passenger-form">
                                                <h5>Passenger {index + 1}</h5>
                                                <div className="flight-form-grid">
                                                    <div className="flight-form-group">
                                                        <label>Title</label>
                                                        <select
                                                            value={passenger.title}
                                                            onChange={(e) => {
                                                                const newPassengers = [...bookingData.passengers]
                                                                newPassengers[index].title = e.target.value
                                                                setBookingData((prev) => ({ ...prev, passengers: newPassengers }))
                                                            }}
                                                            className="flight-form-select"
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Mr">Mr</option>
                                                            <option value="Ms">Ms</option>
                                                            <option value="Mrs">Mrs</option>
                                                            <option value="Dr">Dr</option>
                                                        </select>
                                                    </div>
                                                    <div className="flight-form-group">
                                                        <label>First Name</label>
                                                        <input
                                                            type="text"
                                                            value={passenger.firstName}
                                                            onChange={(e) => {
                                                                const newPassengers = [...bookingData.passengers]
                                                                newPassengers[index].firstName = e.target.value
                                                                setBookingData((prev) => ({ ...prev, passengers: newPassengers }))
                                                            }}
                                                            className="flight-form-input"
                                                        />
                                                    </div>
                                                    <div className="flight-form-group">
                                                        <label>Last Name</label>
                                                        <input
                                                            type="text"
                                                            value={passenger.lastName}
                                                            onChange={(e) => {
                                                                const newPassengers = [...bookingData.passengers]
                                                                newPassengers[index].lastName = e.target.value
                                                                setBookingData((prev) => ({ ...prev, passengers: newPassengers }))
                                                            }}
                                                            className="flight-form-input"
                                                        />
                                                    </div>
                                                    <div className="flight-form-group">
                                                        <label>Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={passenger.dateOfBirth}
                                                            onChange={(e) => {
                                                                const newPassengers = [...bookingData.passengers]
                                                                newPassengers[index].dateOfBirth = e.target.value
                                                                setBookingData((prev) => ({ ...prev, passengers: newPassengers }))
                                                            }}
                                                            className="flight-form-input"
                                                        />
                                                    </div>
                                                    <div className="flight-form-group">
                                                        <label>Nationality</label>
                                                        <select
                                                            value={passenger.nationality}
                                                            onChange={(e) => {
                                                                const newPassengers = [...bookingData.passengers]
                                                                newPassengers[index].nationality = e.target.value
                                                                setBookingData((prev) => ({ ...prev, passengers: newPassengers }))
                                                            }}
                                                            className="flight-form-select"
                                                        >
                                                            <option value="Nepali">Nepali</option>
                                                            <option value="Indian">Indian</option>
                                                            <option value="American">American</option>
                                                            <option value="British">British</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div className="flight-form-group">
                                                        <label>Passport Number</label>
                                                        <input
                                                            type="text"
                                                            value={passenger.passportNumber}
                                                            onChange={(e) => {
                                                                const newPassengers = [...bookingData.passengers]
                                                                newPassengers[index].passportNumber = e.target.value
                                                                setBookingData((prev) => ({ ...prev, passengers: newPassengers }))
                                                            }}
                                                            className="flight-form-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Step 2: Contact Information */}
                                {bookingStep === 2 && (
                                    <div className="flight-booking-step-content">
                                        <h4>
                                            <FaEnvelope className="flight-details-icon" /> Contact Information
                                        </h4>
                                        <div className="flight-form-grid">
                                            <div className="flight-form-group">
                                                <label>Email Address</label>
                                                <input
                                                    type="email"
                                                    value={bookingData.contactInfo.email}
                                                    onChange={(e) =>
                                                        setBookingData((prev) => ({
                                                            ...prev,
                                                            contactInfo: { ...prev.contactInfo, email: e.target.value },
                                                        }))
                                                    }
                                                    className="flight-form-input"
                                                />
                                            </div>
                                            <div className="flight-form-group">
                                                <label>Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={bookingData.contactInfo.phone}
                                                    onChange={(e) =>
                                                        setBookingData((prev) => ({
                                                            ...prev,
                                                            contactInfo: { ...prev.contactInfo, phone: e.target.value },
                                                        }))
                                                    }
                                                    className="flight-form-input"
                                                />
                                            </div>
                                            <div className="flight-form-group flight-form-group-full">
                                                <label>Address</label>
                                                <textarea
                                                    value={bookingData.contactInfo.address}
                                                    onChange={(e) =>
                                                        setBookingData((prev) => ({
                                                            ...prev,
                                                            contactInfo: { ...prev.contactInfo, address: e.target.value },
                                                        }))
                                                    }
                                                    className="flight-form-textarea"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="flight-form-group">
                                                <label>Emergency Contact</label>
                                                <input
                                                    type="tel"
                                                    value={bookingData.contactInfo.emergencyContact}
                                                    onChange={(e) =>
                                                        setBookingData((prev) => ({
                                                            ...prev,
                                                            contactInfo: { ...prev.contactInfo, emergencyContact: e.target.value },
                                                        }))
                                                    }
                                                    className="flight-form-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Payment Information */}
                                {bookingStep === 3 && (
                                    <div className="flight-booking-step-content">
                                        <h4>
                                            <FaCreditCard className="flight-details-icon" /> Payment Information
                                        </h4>

                                        <div className="flight-payment-methods">
                                            <label className="flight-payment-method">
                                                <input
                                                    type="radio"
                                                    value="card"
                                                    checked={bookingData.paymentInfo.method === "card"}
                                                    onChange={(e) =>
                                                        setBookingData((prev) => ({
                                                            ...prev,
                                                            paymentInfo: { ...prev.paymentInfo, method: e.target.value },
                                                        }))
                                                    }
                                                />
                                                <FaCreditCard className="flight-payment-icon" />
                                                <span>Credit/Debit Card</span>
                                            </label>
                                            <label className="flight-payment-method">
                                                <input
                                                    type="radio"
                                                    value="esewa"
                                                    checked={bookingData.paymentInfo.method === "esewa"}
                                                    onChange={(e) =>
                                                        setBookingData((prev) => ({
                                                            ...prev,
                                                            paymentInfo: { ...prev.paymentInfo, method: e.target.value },
                                                        }))
                                                    }
                                                />
                                                <FaPhone className="flight-payment-icon" />
                                                <span>eSewa</span>
                                            </label>
                                            <label className="flight-payment-method">
                                                <input
                                                    type="radio"
                                                    value="khalti"
                                                    checked={bookingData.paymentInfo.method === "khalti"}
                                                    onChange={(e) =>
                                                        setBookingData((prev) => ({
                                                            ...prev,
                                                            paymentInfo: { ...prev.paymentInfo, method: e.target.value },
                                                        }))
                                                    }
                                                />
                                                <FaPhone className="flight-payment-icon" />
                                                <span>Khalti</span>
                                            </label>
                                        </div>

                                        {bookingData.paymentInfo.method === "card" && (
                                            <div className="flight-form-grid">
                                                <div className="flight-form-group flight-form-group-full">
                                                    <label>Card Number</label>
                                                    <input
                                                        type="text"
                                                        value={bookingData.paymentInfo.cardNumber}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                paymentInfo: { ...prev.paymentInfo, cardNumber: e.target.value },
                                                            }))
                                                        }
                                                        className="flight-form-input"
                                                        placeholder="1234 5678 9012 3456"
                                                    />
                                                </div>
                                                <div className="flight-form-group">
                                                    <label>Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        value={bookingData.paymentInfo.expiryDate}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                paymentInfo: { ...prev.paymentInfo, expiryDate: e.target.value },
                                                            }))
                                                        }
                                                        className="flight-form-input"
                                                        placeholder="MM/YY"
                                                    />
                                                </div>
                                                <div className="flight-form-group">
                                                    <label>CVV</label>
                                                    <input
                                                        type="text"
                                                        value={bookingData.paymentInfo.cvv}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                paymentInfo: { ...prev.paymentInfo, cvv: e.target.value },
                                                            }))
                                                        }
                                                        className="flight-form-input"
                                                        placeholder="123"
                                                    />
                                                </div>
                                                <div className="flight-form-group flight-form-group-full">
                                                    <label>Cardholder Name</label>
                                                    <input
                                                        type="text"
                                                        value={bookingData.paymentInfo.cardName}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                paymentInfo: { ...prev.paymentInfo, cardName: e.target.value },
                                                            }))
                                                        }
                                                        className="flight-form-input"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flight-additional-services">
                                            <h5>Additional Services</h5>
                                            <div className="flight-services-grid">
                                                <label className="flight-service-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={bookingData.additionalServices.extraBaggage}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                additionalServices: { ...prev.additionalServices, extraBaggage: e.target.checked },
                                                            }))
                                                        }
                                                    />
                                                    <span>Extra Baggage (+NPR 2,000)</span>
                                                </label>
                                                <label className="flight-service-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={bookingData.additionalServices.seatSelection}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                additionalServices: { ...prev.additionalServices, seatSelection: e.target.checked },
                                                            }))
                                                        }
                                                    />
                                                    <span>Seat Selection (+NPR 1,500)</span>
                                                </label>
                                                <label className="flight-service-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={bookingData.additionalServices.meal}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                additionalServices: { ...prev.additionalServices, meal: e.target.checked },
                                                            }))
                                                        }
                                                    />
                                                    <span>Special Meal (+NPR 800)</span>
                                                </label>
                                                <label className="flight-service-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={bookingData.additionalServices.insurance}
                                                        onChange={(e) =>
                                                            setBookingData((prev) => ({
                                                                ...prev,
                                                                additionalServices: { ...prev.additionalServices, insurance: e.target.checked },
                                                            }))
                                                        }
                                                    />
                                                    <span>Travel Insurance (+NPR 1,200)</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Review and Confirm */}
                                {bookingStep === 4 && (
                                    <div className="flight-booking-step-content">
                                        <h4>
                                            <FaCheckCircle className="flight-details-icon" /> Review Your Booking
                                        </h4>

                                        <div className="flight-booking-summary">
                                            <div className="flight-summary-section">
                                                <h5>Flight Details</h5>
                                                <div className="flight-summary-item">
                                                    <span>Flight:</span>
                                                    <span>
                                                        {selectedFlight.id} - {selectedFlight.airline}
                                                    </span>
                                                </div>
                                                <div className="flight-summary-item">
                                                    <span>Route:</span>
                                                    <span>
                                                        {selectedFlight.from} → {selectedFlight.to}
                                                    </span>
                                                </div>
                                                <div className="flight-summary-item">
                                                    <span>Date:</span>
                                                    <span>{departureDate}</span>
                                                </div>
                                                <div className="flight-summary-item">
                                                    <span>Time:</span>
                                                    <span>
                                                        {selectedFlight.departure} - {selectedFlight.arrival}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flight-summary-section">
                                                <h5>Passengers</h5>
                                                {bookingData.passengers.map((passenger, index) => (
                                                    <div key={index} className="flight-summary-item">
                                                        <span>Passenger {index + 1}:</span>
                                                        <span>
                                                            {passenger.title} {passenger.firstName} {passenger.lastName}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flight-summary-section">
                                                <h5>Price Breakdown</h5>
                                                <div className="flight-summary-item">
                                                    <span>Base Price ({passengers} passengers):</span>
                                                    <span>{formatNPR(selectedFlight.price * Number.parseInt(passengers))}</span>
                                                </div>
                                                {bookingData.additionalServices.extraBaggage && (
                                                    <div className="flight-summary-item">
                                                        <span>Extra Baggage:</span>
                                                        <span>{formatNPR(2000)}</span>
                                                    </div>
                                                )}
                                                {bookingData.additionalServices.seatSelection && (
                                                    <div className="flight-summary-item">
                                                        <span>Seat Selection:</span>
                                                        <span>{formatNPR(1500)}</span>
                                                    </div>
                                                )}
                                                {bookingData.additionalServices.meal && (
                                                    <div className="flight-summary-item">
                                                        <span>Special Meal:</span>
                                                        <span>{formatNPR(800)}</span>
                                                    </div>
                                                )}
                                                {bookingData.additionalServices.insurance && (
                                                    <div className="flight-summary-item">
                                                        <span>Travel Insurance:</span>
                                                        <span>{formatNPR(1200)}</span>
                                                    </div>
                                                )}
                                                <div className="flight-summary-item flight-summary-total">
                                                    <span>Total Amount:</span>
                                                    <span>
                                                        {formatNPR(
                                                            selectedFlight.price * Number.parseInt(passengers) +
                                                            (bookingData.additionalServices.extraBaggage ? 2000 : 0) +
                                                            (bookingData.additionalServices.seatSelection ? 1500 : 0) +
                                                            (bookingData.additionalServices.meal ? 800 : 0) +
                                                            (bookingData.additionalServices.insurance ? 1200 : 0),
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flight-booking-terms">
                                            <label className="flight-terms-checkbox">
                                                <input type="checkbox" required />
                                                <span>
                                                    I agree to the{" "}
                                                    <a href="/" className="flight-terms-link">
                                                        Terms and Conditions
                                                    </a>{" "}
                                                    and{" "}
                                                    <a href="/" className="flight-terms-link">
                                                        Privacy Policy
                                                    </a>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flight-booking-navigation">
                                    {bookingStep > 1 && (
                                        <button className="flight-booking-nav-button flight-booking-prev" onClick={prevBookingStep}>
                                            Previous
                                        </button>
                                    )}
                                    {bookingStep < 4 ? (
                                        <button className="flight-booking-nav-button flight-booking-next" onClick={nextBookingStep}>
                                            Next
                                        </button>
                                    ) : (
                                        <button className="flight-booking-nav-button flight-booking-confirm" onClick={handleBookingSubmit}>
                                            <FaShieldAlt className="flight-button-icon" />
                                            <span>Confirm Booking</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <Footer />
            </div>
        </div>

    )
}

export default NepalFlightTracker;