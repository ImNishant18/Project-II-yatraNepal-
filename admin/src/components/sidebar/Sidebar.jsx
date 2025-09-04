import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HotelIcon from '@mui/icons-material/Hotel';
import KingBedIcon from '@mui/icons-material/KingBed';
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import logo from "../../assets/logo.png";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ImageIcon from '@mui/icons-material/Image';
const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear stored auth info
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
            <span className="logo">yatraNepal</span>
          </div>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>

          <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>

          <Link to="/hotels" style={{ textDecoration: "none" }}>
            <li>
              <HotelIcon className="icon" />
              <span>Hotels</span>
            </li>
          </Link>

          <Link to="/rooms" style={{ textDecoration: "none" }}>
            <li>
              <KingBedIcon className="icon" />
              <span>Rooms</span>
            </li>
          </Link>

          <Link to="/money-exchange" style={{ textDecoration: "none" }}>
            <li>
              <CurrencyExchangeIcon className="icon" />
              <span>Money Exchange</span>
            </li>
          </Link>
          <Link to="/touristguide" style={{ textDecoration: "none" }}>
            <li>
              < PersonOutlineIcon className="icon" />
              <span>Tourist Guide</span>
            </li>
          </Link>
          <Link to="/place" style={{ textDecoration: "none" }}>
            <li>
              <LocationOnIcon className="icon" />
              <span>Places</span>
            </li>
          </Link>

          <Link to="/chadparba" style={{ textDecoration: "none" }}>
            <li>
              <EventIcon className="icon" />
              <span>Events</span>
            </li>
          </Link>
          <Link to="/admin-booking" style={{ textDecoration: "none" }}>
            <li>
              <ConfirmationNumberIcon className="icon" />
              <span>Bookings</span>
            </li>
          </Link>

          <Link to="/imageslider" style={{ textDecoration: "none" }}>
            <li>
              < ImageIcon className="icon" />
              <span>Image Slider</span>
            </li>
          </Link>


          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>

          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>

          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;