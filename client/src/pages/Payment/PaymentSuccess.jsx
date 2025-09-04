import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);

    const reservationId = searchParams.get("reservationId");
    const gateway = searchParams.get("gateway");

    useEffect(() => {
        const fetchReservationDetails = async () => {
            if (!reservationId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8800/api/payment/status/${reservationId}`
                );
                setReservation(response.data);
            } catch (err) {
                console.error("Error fetching reservation details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservationDetails();
    }, [reservationId]);

    if (loading) {
        return <div className="payment-status loading">Loading...</div>;
    }

    return (
        <div className="payment-status success">
            <div className="status-container">
                <div className="status-icon">✅</div>
                <h2>Payment Successful!</h2>
                <p>Thank you for your payment through {gateway || 'the payment gateway'}.</p>

                {reservation && (
                    <div className="reservation-details">
                        <h3>Reservation Details</h3>
                        <p><strong>Reservation ID:</strong> {reservation.reservationId}</p>
                        <p><strong>Amount Paid:</strong> Rs. {reservation.totalPrice}</p>
                        <p><strong>Status:</strong> {reservation.status}</p>
                        <p><strong>Transaction ID:</strong> {reservation.transactionId}</p>
                    </div>
                )}

                <button
                    className="view-bookings-btn"
                    onClick={() => navigate("/bookings")}
                >
                    View My Bookings
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;