import React, { useState } from "react";
import api from "../../utils/api";
import "./Payment.css";

const Payment = ({ reservation, onSuccess, onCancel }) => {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    if (!reservation) return null;

    const handlePayment = async (method) => {
        if (!reservation._id) {
            setError("Invalid reservation data");
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            if (method === "esewa") {
                const response = await api.post("/payment/esewa/initiate", {
                    reservationId: reservation._id,
                    amount: reservation.totalAmount,
                });

                if (response.data.success) {
                    // Create and submit form to eSewa
                    const form = document.createElement("form");
                    form.method = "POST";
                    form.action = response.data.paymentUrl;

                    Object.entries(response.data.params).forEach(([key, value]) => {
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        input.value = value;
                        form.appendChild(input);
                    });

                    document.body.appendChild(form);
                    form.submit();
                } else {
                    setError("Failed to initiate eSewa payment");
                }
            } else if (method === "khalti") {
                const response = await api.post("/payment/khalti/initiate", {
                    reservationId: reservation._id,
                    amount: reservation.totalAmount,
                });

                if (response.data.success) {
                    window.location.href = response.data.paymentUrl;
                } else {
                    setError("Failed to initiate Khalti payment");
                }
            }
        } catch (err) {
            console.error("Payment initiation error:", err);
            setError(err.response?.data?.message || "Payment initiation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCashPayment = async () => {
        setIsProcessing(true);
        setError("");

        try {
            const response = await api.post("/payment/cash/process", {
                reservationId: reservation._id,
            });

            if (response.data.success) {
                onSuccess();
            } else {
                setError("Failed to process cash payment");
            }
        } catch (err) {
            console.error("Cash payment error:", err);
            setError(err.response?.data?.message || "Cash payment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-modal">
            <div className="payment-container">
                <h2>Select Payment Method</h2>

                {error && <div className="payment-error">{error}</div>}

                <div className="payment-methods">
                    <div className="payment-method">
                        <input
                            type="radio"
                            id="esewa"
                            name="paymentMethod"
                            value="esewa"
                            onChange={(e) => setSelectedMethod(e.target.value)}
                        />
                        <label htmlFor="esewa">
                            <img src="/esewa-logo.png" alt="eSewa" className="payment-logo" />
                            eSewa
                        </label>
                    </div>

                    <div className="payment-method">
                        <input
                            type="radio"
                            id="khalti"
                            name="paymentMethod"
                            value="khalti"
                            onChange={(e) => setSelectedMethod(e.target.value)}
                        />
                        <label htmlFor="khalti">
                            <img src="/khalti-logo.png" alt="Khalti" className="payment-logo" />
                            Khalti
                        </label>
                    </div>

                    <div className="payment-method">
                        <input
                            type="radio"
                            id="cash"
                            name="paymentMethod"
                            value="cash"
                            onChange={(e) => setSelectedMethod(e.target.value)}
                        />
                        <label htmlFor="cash">
                            <span className="cash-icon">💵</span> Pay in Cash
                        </label>
                    </div>
                </div>

                <div className="payment-summary">
                    <h3>Payment Summary</h3>
                    <p>Reservation ID: {reservation._id}</p>
                    <p>Total Amount: Rs. {reservation.totalAmount}</p>
                    {reservation.roomDetails && reservation.roomDetails.length > 0 && (
                        <p>Selected Rooms: {reservation.roomDetails.map(r => r.number).join(", ")}</p>
                    )}
                </div>

                <div className="payment-actions">
                    <button
                        className="payment-cancel"
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>

                    {selectedMethod === "cash" ? (
                        <button
                            className="payment-confirm"
                            onClick={handleCashPayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Confirm Cash Payment"}
                        </button>
                    ) : (
                        <button
                            className="payment-proceed"
                            onClick={() => handlePayment(selectedMethod)}
                            disabled={!selectedMethod || isProcessing}
                        >
                            {isProcessing ? "Redirecting..." : "Proceed to Payment"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;