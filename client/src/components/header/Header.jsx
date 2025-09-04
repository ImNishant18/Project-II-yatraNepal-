import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Bed, Plane, Menu, Search, X } from "lucide-react";
import {
  FaLocationArrow,
  FaMoneyBill,
  FaPersonBooth,
  FaCalendarAlt,
  FaLightbulb,
  FaMapMarkerAlt,
  FaBuilding,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
import "./header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate hook

  // Check screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setOpenDropdown(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.length >= 2) fetchSuggestions(searchTerm);
      else setSuggestions([]);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchSuggestions = async (term) => {
    setIsSearchLoading(true);
    try {
      const res = await fetch(`/api/search?query=${term}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Search error:", err);
      setSuggestions([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentSection = pathSegments[0]?.toLowerCase() || 'home';

  const navItems = [
    { id: "home", icon: <Home className="nav-icon" />, label: "Home", href: "/" },
    { id: "places", icon: <FaLocationArrow className="nav-icon" />, label: "Places", href: "/places" },
    { id: "stays", icon: <Bed className="nav-icon" />, label: "Stays", href: "/stays" },
    { id: "flights", icon: <Plane className="nav-icon" />, label: "Flights", href: "/flights" },
    { id: "money-exchange", icon: <FaMoneyBill className="nav-icon" />, label: "Exchange", href: "/money-exchange" },
    { id: "touristguide", icon: <FaPersonBooth className="nav-icon" />, label: "Guide", href: "/touristguide" },
    {
      id: "more",
      label: "More",
      submenu: [
        { id: "events", icon: <FaLightbulb className="nav-icon" />, label: "Events", href: "/events" },
        { id: "calendar", icon: <FaCalendarAlt className="nav-icon" />, label: "Calendar", href: "/calendar" },
      ]
    }
  ];

  const promoContent = {
    home: {
      title: "A lifetime of discounts? It's Genius.",
      desc: "Get rewarded for your travels – unlock instant savings of 10% or more with a free yatraNepal account.",
    },
    places: {
      title: "Discover the best places to visit in Nepal.",
      desc: "Explore top destinations, hidden gems, and local favorites with personalized recommendations.",
    },
    stays: {
      title: "Find your perfect stay.",
      desc: "Browse hotels, resorts, and more at the best prices with flexible booking options.",
    },
    flights: {
      title: "Take off with the best deals.",
      desc: "Compare hundreds of airlines and get the lowest fares for your next trip.",
    },
    "money-exchange": {
      title: "Save on every exchange.",
      desc: "Get rewarded for your exchanges – unlock instant savings of 10% or more with a free MoneyExchange account.",
    },
    touristguide: {
      title: "Explore Nepal like a local.",
      desc: "Get personalized recommendations for your next trip.",
    },
    events: {
      title: "Never miss an event in Nepal.",
      desc: "Get updates on local festivals, concerts, and cultural celebrations.",
    },
    calendar: {
      title: "Check Nepali Calendar and Events.",
      desc: "Explore Nepali events and cultural highlights in one place.",
    },
  };

  const { title, desc } = promoContent[currentSection] || promoContent.home;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (!isSearchOpen) {
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleMouseEnter = (id) => {
    if (!isMobile) {
      setOpenDropdown(id);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpenDropdown(null);
    }
  };

  // Function to handle search item click and redirect
  const handleSearchItemClick = (item) => {
    setSearchTerm("");
    setSuggestions([]);
    setIsSearchOpen(false);
    
    // Determine the correct route based on the item type
    let route = "";
    switch(item.reviewedModel) {
      case "Place":
        route = `/place/${item._id}`;
        break;
      case "Hotel":
        route = `/stays/${item._id}`;
        break;
      case "ExchangeCenter":
        route = `/money-exchange/${item._id}`;
        break;
      case "TouristGuide":
        route = `/touristguide/${item._id}`;
        break;
      default:
        route = `/${item.reviewedModel.toLowerCase()}/${item._id}`;
    }
    
    navigate(route);
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
      Place: "header-badge-place",
      Hotel: "header-badge-hotel",
      ExchangeCenter: "header-badge-exchange",
      TouristGuide: "header-badge-guide",
    }[type] || "header-badge-default");

  return (
    <div className="travel-header">
      <div className="header-container">
        {/* Mobile Header Bar */}
        <div className="mobile-header-bar">
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="mobile-logo">
            <Link to="/">yatraNepal</Link>
          </div>
          
          <button 
            className="search-toggle" 
            onClick={toggleSearch}
            aria-label="Toggle search"
          >
            {isSearchOpen ? <X size={24} /> : <Search size={24} />}
          </button>
        </div>

        {/* Search Component - Shows differently on mobile */}
        <div className={`header-search-container ${isSearchOpen ? "open" : ""}`}>
          <form className="header-search-form">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search hotels, places, guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="header-search-input"
            />
            {isSearchLoading && <span className="header-search-loading">Searching...</span>}
          </form>

          {suggestions.length > 0 && (
            <div className="header-suggestions-container">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  className="header-suggestion-item"
                  onClick={() => handleSearchItemClick(item)}
                >
                  <div className="header-suggestion-left">
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
        </div>

        {/* Navigation - Horizontal on desktop, vertical drawer on mobile */}
        <nav className={`nav-container ${isMenuOpen ? "open" : ""}`}>
          {navItems.map((item) =>
            item.submenu ? (
              <div
                key={item.id}
                className={`nav-dropdown ${openDropdown === item.id ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="dropdown-label"
                  onClick={() => isMobile && toggleDropdown(item.id)}
                >
                  <span className={`nav-link ${currentSection === item.id ? "active" : ""}`}>
                    {item.icon}
                    <span className="nav-text">{item.label}</span>
                    {isMobile && <span className="dropdown-arrow"></span>}
                  </span>
                  {!isMobile && <span className="dropdown-arrow"></span>}
                </div>
                <div className={`dropdown-content ${openDropdown === item.id ? "show" : ""}`}>
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.id}
                      to={sub.href}
                      className={`nav-link ${currentSection === sub.id ? "active" : ""}`}
                      onClick={() => isMobile && setIsMenuOpen(false)}
                    >
                      {sub.icon}
                      <span className="nav-text">{sub.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.id}
                to={item.href}
                className={`nav-link ${currentSection === item.id ? "active" : ""}`}
                onClick={() => isMobile && setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="nav-text">{item.label}</span>
                <span className="nav-link-hover"></span>
                <span className="nav-link-active"></span>
              </Link>
            )
          )}
        </nav>

        {/* Promo Text - Hidden on mobile when menu/search is open */}
        {(!isMobile || (!isMenuOpen && !isSearchOpen)) && (
          <div className="promo-text">
            <h1 className="promo-title">{title}</h1>
            <p className="promo-desc">{desc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;