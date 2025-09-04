import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      const res = await fetch(`${BASE_URL}/api/booking/${id}`, { credentials: "include" });
      if (res.ok) setBooking(await res.json());
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    const res = await fetch(`${BASE_URL}/api/booking/cancel/${id}`, {
      method: "PUT",
      credentials: "include",
    });
    if (res.ok) {
      alert("Booking canceled!");
      navigate("/user-dashboard");
    } else alert("Cancellation failed");
  };

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div>
      <h2>Booking Details</h2>
      <p>Guide: {booking.guideId?.name}</p>
      <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p>Payment: {booking.paymentMethod}</p>
      <p>Status: {booking.status}</p>
      {booking.cancellationReason && <p>Reason: {booking.cancellationReason}</p>}
      {booking.status === "booked" && <button onClick={handleCancel}>Cancel Booking</button>}
    </div>
  );
};

export default BookingDetails;