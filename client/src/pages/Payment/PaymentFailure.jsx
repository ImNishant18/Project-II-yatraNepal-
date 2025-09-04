import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Payment.css";

const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const navigate = useSearchParams();

    const error = searchParams.get("error");
    const reservationId = searchParams.get("reservationId");
    const gateway = searchParams.get("gateway");

    const getErrorMessage = () => {
        switch (error) {
            case "no_reservation_id":
                return "No reservation ID provided.";
            case "reservation_not_found":
                return "Reservation not found.";
            case "signature_mismatch":
                return "Payment verification failed. Please contact support.";
            case "verification_failed":
                return "Payment verification failed. Please try again.";
            default:
                return "Payment failed. Please try again or contact support if the problem persists.";
        }
    };

    return (
        <div className="payment-status failure">
            <div className="status-container">
                <div className="status-icon">❌</div>
                <h2>Payment Failed</h2>
                <p>{getErrorMessage()}</p>

                <div className="action-buttons">
                    <button
                        className="retry-btn"
                        onClick={() => navigate(`/reserve?reservationId=${reservationId}`)}
                    >
                        Try Again
                    </button>
                    <button
                        className="home-btn"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;