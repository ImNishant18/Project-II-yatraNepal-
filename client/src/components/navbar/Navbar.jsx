import React, { useContext, useState, useRef, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import { IoMenu } from "react-icons/io5";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const dropdownRef = useRef();

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  // Navigation handlers
  const handleLoginClick = () => {
    navigate("/login");
    setProfileMenuOpen(false);
  };
  const handleRegisterClick = () => {
    navigate("/register");
    setProfileMenuOpen(false);
  };
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    setProfileMenuOpen(false);
  };
  const handleProfileClick = () => {
    navigate("/profile");
    setProfileMenuOpen(false);
  };
  const handleMyBookingClick = () => {
    navigate("/bookings");
    setProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Main menus
  const menus = [
    {
      title: "Discover",
      items: [
        { label: "Travellers' Choice", path: "/travellers-choice" },
        { label: "Travel Stories", path: "/travel-stories" },
      ],
    },
    {
      title: "Trips",
      items: [
        { label: "View my trips", path: "/trips" },
        { label: "Start a new trip", path: "/trips" },
        { label: "Create a trip with AI", path: "/trips" },
      ],
    },
    {
      title: "Review",
      items: [
        { label: "Write a review", path: "/write-review" },
        { label: "View all reviews", path: "/reviews" },
      ],
    },
    {
      title: "Blog",
      items: [
        { label: "Write a Blog", path: "/write-blog" },
        { label: "View Blog", path: "/blog" },
      ],
    },
  ];

  // Hamburger for mobile - left icon
  function Hamburger() {
    return (
      <button
        aria-label="Open menu"
        className="hamburger"
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <IoMenu className="menu-icon" />
      </button>
    );
  }

  // User icon or initial - right icon
  function UserIcon() {
    if (user?.img) {
      return (
        <button
          aria-label="Open profile menu"
          className="mobileUserButton"
          onClick={() => setProfileMenuOpen((open) => !open)}
        >
          <img src={user.img} alt="Profile" className="mobileUserAvatar" />
        </button>
      );
    }
    return (
      <button
        aria-label="Open profile menu"
        className="mobileUserButton"
        onClick={() => setProfileMenuOpen((open) => !open)}
      >
        <span className="mobileUserIcon">
          {user ? (
            getInitial(user.username)
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="4" y="16" width="16" height="4" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
        </span>
      </button>
    );
  }

  return (
    <header className="navbar">
      <div className="navMobileContainer">
        {/* Hamburger */}
        <Hamburger />

        {/* Logo */}
        <Link to="/" className="logo-container" onClick={() => setMobileMenuOpen(false)}>
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">yatraNepal</span>
        </Link>

        {/* User/Profile Icon */}
        <div ref={dropdownRef}>
          <UserIcon />
        </div>
      </div>

      {/* MOBILE MENU Drawer */}
      <nav className={`mobileMenuDrawer${mobileMenuOpen ? " open" : ""}`}>
        <button className="closeDrawer" onClick={() => setMobileMenuOpen(false)}>
          ×
        </button>

        <ul className="mobileMenuList">
          {menus.map((menu) => (
            <React.Fragment key={menu.title}>
              <li className="mobileMenuHeader">{menu.title}</li>
              {menu.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="mobileMenuItem"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      {/* MOBILE Profile / Login Menu */}
      {profileMenuOpen && (
        <div className="mobileProfileMenu">
          {user ? (
            <>
              <button className="button-17 profileMenuItem" onClick={handleMyBookingClick}>
                My Booking
              </button>
              <button className="button-17 profileMenuItem" onClick={handleProfileClick}>
                View Profile
              </button>
              <button className="button-17 profileMenuItem" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="button-17 profileMenuItem" onClick={handleRegisterClick}>
                Register
              </button>
              <button className="button-17 profileMenuItem" onClick={handleLoginClick}>
                Login
              </button>
            </>
          )}
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="desktopNav">
        <div className="desktopNavContainer">
          <Link to="/" className="desktopLogo">
            <img src={logo} alt="Logo" className="desktopLogo-img" />
            <span className="desktopLogo-text">yatraNepal</span>
          </Link>

          <nav className="desktopMenu">
            {menus.map((menu) => (
              <div key={menu.title} className="desktopMenuItem">
                <button
                  className={`desktopMenuButton hover-3 ${menuOpen === menu.title ? "active" : ""}`}
                  onClick={() => setMenuOpen(menuOpen === menu.title ? null : menu.title)}
                >
                  {menu.title}
                </button>
                {menuOpen === menu.title && (
                  <div className="desktopDropdown">
                    {menu.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="desktopDropdownItem hover-3"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {user ? (
            <div className="desktopProfile" ref={dropdownRef}>
              <button
                className="desktopProfileButton"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {user.img ? (
                  <img src={user.img} alt="Profile" className="desktopUserAvatar" />
                ) : (
                  <span className="desktopUserInitial">{getInitial(user.username)}</span>
                )}
              </button>
              {profileMenuOpen && (
                <div className="desktopProfileDropdown">
                  <button className="desktopProfileDropdownItem" onClick={handleMyBookingClick}>
                    <span>My Booking</span>
                    <span></span>
                  </button>
                  <button className="desktopProfileDropdownItem" onClick={handleProfileClick}>
                    <span>View Profile</span>
                    <span></span>
                  </button>
                  <button className="desktopProfileDropdownItem" onClick={handleLogout}>
                    <span>Logout</span>
                    <span></span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="desktopAuthButtons">
              <button className="button-17 desktopRegisterButton" onClick={handleRegisterClick}>
                Register
              </button>
              <button className="button-17 desktopLoginButton" onClick={handleLoginClick}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;