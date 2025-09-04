import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import crypto from "crypto";
import axios from "axios";

// Generate eSewa signature
const generateEsewaSignature = (secretKey, message) => {
    return crypto.createHmac("sha256", secretKey).update(message).digest("base64");
};

// Get Payment Status
export const getPaymentStatus = async (req, res) => {
    try {
        const { reservationId } = req.params;

        if (!reservationId) {
            return res.status(400).json({
                success: false,
                message: "Reservation ID is required",
            });
        }

        // Find reservation and populate related fields
        const reservation = await Reservation.findById(reservationId)
            .populate("hotelId", "name photos")
            .populate("userId", "username email");

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }

        // Respond with full reservation info
        res.status(200).json({
            success: true,
            reservationId: reservation._id,
            paymentStatus: reservation.paymentStatus,
            status: reservation.status,
            transactionId: reservation.transactionId,
            totalPrice: reservation.totalPrice,
            dates: reservation.dates,
            hotel: reservation.hotelId,
            user: reservation.userId,
            rooms: reservation.roomDetails,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt
        });
    } catch (err) {
        console.error("Error in getPaymentStatus:", err);
        res.status(500).json({
            success: false,
            message: "Server error while checking payment status",
        });
    }
};

// ✅ Process Cash Payment
export const processCashPayment = async (req, res) => {
    try {
        const { reservationId } = req.body;
        
        if (!reservationId) {
            return res.status(400).json({ 
                success: false, 
                message: "Reservation ID is required" 
            });
        }

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ 
                success: false, 
                message: "Reservation not found" 
            });
        }

        // Update reservation for cash payment
        reservation.paymentStatus = "success";
        reservation.status = "confirmed";
        reservation.paymentMethod = "cash";
        await reservation.save();

        // Update room availability
        for (const { roomId, number } of reservation.roomDetails) {
            await Room.updateOne(
                { _id: roomId, "roomNumbers.number": number },
                { $push: { "roomNumbers.$.unavailableDates": { $each: reservation.dates } } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Cash payment processed successfully",
            reservation
        });
    } catch (error) {
        console.error("Error in processCashPayment:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to process cash payment" 
        });
    }
};

// ✅ Initiate eSewa payment
export const initiateEsewaPayment = async (req, res) => {
    try {
        const { reservationId } = req.body;
        if (!reservationId) {
            return res.status(400).json({ success: false, message: "Reservation ID is required" });
        }

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }

        const amount = reservation.totalPrice;
        const transactionUuid = `${reservation._id}-${Date.now()}`;

        const esewaConfig = {
            amount: amount.toString(),
            tax_amount: "0",
            total_amount: amount.toString(),
            transaction_uuid: transactionUuid,
            product_code: process.env.ESEWA_MERCHANT_CODE,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${process.env.BACKEND_URL}/api/payment/esewa/verify?reservationId=${reservationId}`,
            failure_url: `${process.env.BACKEND_URL}/api/payment/esewa/verify?reservationId=${reservationId}`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
        };

        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const signature = generateEsewaSignature(process.env.ESEWA_SECRET_KEY, signatureString);

        return res.status(200).json({
            success: true,
            paymentUrl: process.env.ESEWA_BASE_URL,
            params: { ...esewaConfig, signature },
        });
    } catch (err) {
        console.error("Error in initiateEsewaPayment:", err);
        res.status(500).json({ success: false, message: "Server error while initiating payment" });
    }
};

// ✅ Verify eSewa payment callback
export const verifyEsewaPayment = async (req, res) => {
    try {
        const { data, reservationId } = req.query;

        if (!reservationId) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=no_reservation_id&gateway=esewa`);
        }

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=reservation_not_found&gateway=esewa`);
        }

        let decodedData;
        try {
            decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
        } catch (parseError) {
            console.error("Error parsing eSewa data:", parseError);
            reservation.paymentStatus = "failed";
            await reservation.save();
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=invalid_data&reservationId=${reservationId}&gateway=esewa`);
        }

        // Verify signature
        const signatureString = `total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code}`;
        const expectedSignature = generateEsewaSignature(process.env.ESEWA_SECRET_KEY, signatureString);

        if (decodedData.signature !== expectedSignature) {
            reservation.paymentStatus = "failed";
            await reservation.save();
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=signature_mismatch&reservationId=${reservationId}&gateway=esewa`);
        }

        if (decodedData.status === "COMPLETE") {
            reservation.paymentStatus = "success";
            reservation.status = "confirmed";
            reservation.paymentMethod = "esewa";
            reservation.transactionId = decodedData.transaction_code;
            reservation.product_code = decodedData.product_code;
            await reservation.save();

            // Update room availability
            for (const { roomId, number } of reservation.roomDetails) {
                await Room.updateOne(
                    { _id: roomId, "roomNumbers.number": number },
                    { $push: { "roomNumbers.$.unavailableDates": { $each: reservation.dates } } }
                );
            }

            return res.redirect(`${process.env.FRONTEND_URL}/payment-success?status=success&reservationId=${reservationId}&gateway=esewa`);
        } else {
            reservation.paymentStatus = "failed";
            await reservation.save();
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?status=failed&reservationId=${reservationId}&gateway=esewa`);
        }
    } catch (err) {
        console.error("Error in verifyEsewaPayment:", err);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=server_error&gateway=esewa`);
    }
};

// ✅ Initiate Khalti Payment
export const initiateKhaltiPayment = async (req, res) => {
    try {
        const { reservationId } = req.body;
        
        if (!reservationId) {
            return res.status(400).json({ 
                success: false, 
                message: "Reservation ID is required" 
            });
        }

        const reservation = await Reservation.findById(reservationId).populate("userId");
        if (!reservation) {
            return res.status(404).json({ 
                success: false, 
                message: "Reservation not found" 
            });
        }

        const payload = {
            return_url: `${process.env.BACKEND_URL}/api/payment/khalti/verify?reservationId=${reservationId}`,
            website_url: process.env.FRONTEND_URL,
            amount: Math.round(reservation.totalPrice * 100), // Convert to paisa
            purchase_order_id: reservationId,
            purchase_order_name: `Hotel_Reservation_${reservationId}`,
            customer_info: {
                name: reservation.userId.username || "Customer",
                email: reservation.userId.email || "customer@example.com",
                phone: reservation.userId.phone || "9800000000",
            },
        };

        const response = await axios.post(
            `${process.env.KHALTI_BASE_URL}/epayment/initiate/`,
            payload,
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Save pidx to reservation
        reservation.pidx = response.data.pidx;
        await reservation.save();

        res.status(200).json({
            success: true,
            paymentUrl: response.data.payment_url,
            pidx: response.data.pidx,
        });
    } catch (error) {
        console.error("Error in initiateKhaltiPayment:", error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to initiate Khalti payment" 
        });
    }
};

// ✅ Verify Khalti Payment
export const verifyKhaltiPayment = async (req, res) => {
    try {
        const { pidx, transaction_id, purchase_order_id } = req.query;
        const reservationId = purchase_order_id;

        if (!reservationId) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=no_reservation_id&gateway=khalti`);
        }

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=reservation_not_found&gateway=khalti`);
        }

        // Verify payment with Khalti
        const response = await axios.post(
            process.env.KHALTI_VERIFY_URL,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );

        if (response.data.status === "Completed") {
            // Payment successful
            reservation.paymentStatus = "success";
            reservation.status = "confirmed";
            reservation.paymentMethod = "khalti";
            reservation.transactionId = transaction_id || pidx;
            await reservation.save();

            // Update room availability
            for (const { roomId, number } of reservation.roomDetails) {
                await Room.updateOne(
                    { _id: roomId, "roomNumbers.number": number },
                    { $push: { "roomNumbers.$.unavailableDates": { $each: reservation.dates } } }
                );
            }

            return res.redirect(`${process.env.FRONTEND_URL}/payment-success?status=success&reservationId=${reservationId}&gateway=khalti`);
        } else {
            // Payment failed
            reservation.paymentStatus = "failed";
            await reservation.save();
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?status=failed&reservationId=${reservationId}&gateway=khalti`);
        }
    } catch (error) {
        console.error("Error in verifyKhaltiPayment:", error.response?.data || error.message);
        
        // Try to get reservationId from query or error data
        const reservationId = req.query.purchase_order_id;
        if (reservationId) {
            // Mark payment as failed
            await Reservation.findByIdAndUpdate(reservationId, {
                paymentStatus: "failed"
            });
        }
        
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=verification_failed&gateway=khalti${reservationId ? `&reservationId=${reservationId}` : ''}`);
    }
};