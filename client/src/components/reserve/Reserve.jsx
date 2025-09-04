import React, { useContext, useState, useEffect } from "react";   // <-- added useEffect
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "./Reserve.css";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Payment from "./Payment";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Added from code2
  const [showPayment, setShowPayment] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  const { data: rooms = [], loading, error } = useFetch(`  http://localhost:8800/api/hotels/rooms/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];
    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const alldates = dates.length > 0 ? getDatesInRange(dates[0].startDate, dates[0].endDate) : [];

  const isAvailable = (roomNumber) => {
    return !roomNumber.unavailableDates?.some(date =>
      alldates.some(d => new Date(d).toDateString() === new Date(date).toDateString())
    );
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const roomId = e.target.getAttribute("data-roomid");
    const roomNumber = parseInt(e.target.getAttribute("data-roomnumber"));
    const numberId = e.target.getAttribute("data-numberid");

    if (!roomId || isNaN(roomNumber) || !numberId) return;

    setSelectedRooms(prev =>
      checked
        ? [...prev, { roomId, number: roomNumber, numberId }]
        : prev.filter(item => item.roomId !== roomId || item.number !== roomNumber)
    );
  };

  const calculateTotalPrice = () => {
    return selectedRooms.reduce((sum, selectedRoom) => {
      const room = rooms.find(r => r._id === selectedRoom.roomId);
      return room ? sum + (room.price * alldates.length) : sum;
    }, 0);
  };

  const handleClick = async () => {
    if (!user) return navigate("/login");
    if (selectedRooms.length === 0) return setErrorMessage("Please select at least one room.");
    if (alldates.length === 0) return setErrorMessage("Please select valid dates.");

    setIsBooking(true);
    setErrorMessage("");

    try {
      const reservationResponse = await axios.post(
        "http://localhost:8800/api/reservations",
        {
          userId: user._id,
          hotelId,
          roomNumbers: selectedRooms.map(r => ({ number: r.number, roomId: r.roomId })),
          dates: alldates,
          totalPrice: calculateTotalPrice(),
          status: "pending",           
          paymentStatus: "pending"   
        },
        { withCredentials: true }
      );

      setReservationData(reservationResponse.data);  
      setShowPayment(true);                        
    } catch (err) {
      console.error("Reservation failed:", err);
      setErrorMessage(
        err.response?.data?.message || err.message || "Reservation failed. Please try again."
      );
    } finally {
      setIsBooking(false);
    }
  };

  // Added from code2
  const handlePaymentSuccess = () => {
    setBookingSuccess(true);
    setShowPayment(false);
    setTimeout(() => {
      setOpen(false);
      navigate("/bookings");
    }, 2000);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  // Added from code2
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reservationId = urlParams.get('reservationId');
      const gateway = urlParams.get('gateway');
      
      if (reservationId && gateway) {
        try {
          const response = await axios.get(
            `http://localhost:8800/api/payment/status/${reservationId}`
          );
          
          if (response.data.paymentStatus === 'success') {
            setReservationData(response.data);
            setBookingSuccess(true);
            setTimeout(() => {
              navigate("/bookings");
            }, 2000);
          }
        } catch (err) {
          console.error("Error checking payment status:", err);
        }
      }
    };

    checkPaymentStatus();
  }, [navigate]);

  if (bookingSuccess) {
    return (
      <div className="reserve">
        <div className="success-message">
          <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
          <h3>Booking Successful!</h3>
          <p>Rooms: {selectedRooms.map(r => r.number).join(", ")}</p>
          <p>Total: Rs. {calculateTotalPrice()}</p>
          <p>Redirecting to bookings...</p>
        </div>
      </div>
    );
  }

  // Added from code2
  if (showPayment && reservationData) {
    return (
      <Payment 
        reservation={reservationData} 
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)} />
        <h2>Select Rooms</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {loading ? (
          <div className="loading">Loading rooms...</div>
        ) : error ? (
          <div className="error">Error loading room data</div>
        ) : rooms.length === 0 ? (
          <div className="empty">No rooms available</div>
        ) : (
          rooms.map(room => (
            <div className="rItem" key={room._id}>
              <div className="rItemInfo">
                <div className="rTitle">{room.title}</div>
                <div className="rDesc">{room.desc}</div>
                <div className="rPrice">Rs. {room.price}/night</div>
                <div className="rMaxPeople">Max: {room.maxPeople} people</div>
              </div>
              <div className="rSelectRooms">
                {room.roomNumbers.map((roomNumber, index) => {
                  const available = isAvailable(roomNumber);
                  return (
                    <div
                      className={`room ${!available ? "unavailable" : ""}`}
                      key={`${room._id}-${roomNumber._id}`}
                    >
                      <label>
                        <span>Room {roomNumber.number}</span>
                        <input
                          type="checkbox"
                          data-roomid={room._id}
                          data-roomnumber={roomNumber.number}
                          data-numberid={roomNumber._id}
                          onChange={handleSelect}
                          disabled={!available}
                          checked={selectedRooms.some(
                            r => r.roomId === room._id && r.number === roomNumber.number
                          )}
                        />
                        {!available && <span className="booked">Booked</span>}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {selectedRooms.length > 0 && (
          <div className="rSummary">
            <h3>Booking Summary</h3>
            <p>Selected Rooms: {selectedRooms.map(r => r.number).join(", ")}</p>
            <p>Total Nights: {alldates.length}</p>
            <p>Total Price: Rs. {calculateTotalPrice()}</p>
          </div>
        )}

        <button
          onClick={handleClick}
          className={`rButton ${isBooking ? "loading" : ""}`}
          disabled={selectedRooms.length === 0 || isBooking}
        >
          {isBooking ? (
            <>
              <span className="spinner"></span> Processing...
            </>
          ) : (
            "Confirm Reservation"
          )}
        </button>
      </div>
    </div>
  );
};

export default Reserve;