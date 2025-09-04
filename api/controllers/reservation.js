import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

// Create reservation
export const createReservation = async (req, res, next) => {
    try {
        const { hotelId, roomNumbers, dates } = req.body;
        const userId = req.user.id;

        if (!hotelId || !roomNumbers?.length || !dates?.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let totalPrice = 0;
        const roomIds = [];
        const roomDetails = [];

        for (const { roomId, number } of roomNumbers) {
            const room = await Room.findById(roomId);
            if (!room) return res.status(404).json({ message: `Room ${roomId} not found` });

            const specificRoom = room.roomNumbers.find((r) => r.number === number);
            if (!specificRoom)
                return res.status(404).json({ message: `Room number ${number} not found` });

            totalPrice += room.price * dates.length;
            roomIds.push(roomId);
            roomDetails.push({ roomId, number, title: room.title });
        }

        const transactionId = `TXN-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        const reservation = new Reservation({
            userId,
            hotelId,
            roomIds,
            roomDetails,
            dates,
            totalPrice,
            transactionId,
            status: "pending",
            paymentStatus: "pending",
        });

        const savedReservation = await reservation.save();

        await User.findByIdAndUpdate(userId, {
            $push: { bookings: savedReservation._id },
        });

        res.status(201).json(savedReservation);
    } catch (err) {
        next(err);
    }
};

// Get all reservations (Admin)
export const getReservations = async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = {};

        if (status && status !== "all") {
            filter.status = status;
        }

        const reservations = await Reservation.find(filter)
            .populate("hotelId", "name")
            .populate("userId", "username email");

        res.status(200).json(reservations);
    } catch (err) {
        next(err);
    }
};

// Get single reservation by ID
export const getReservationById = async (req, res, next) => {
    try {
        const { reservationId } = req.params;
        const reservation = await Reservation.findById(reservationId)
            .populate("hotelId", "name photos")
            .populate("userId", "username email");

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json(reservation);
    } catch (err) {
        next(err);
    }
};

// Get reservations of logged-in user
export const getUserReservations = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user.id;

        if (req.params.userId && req.user.isAdmin !== true) {
            return res
                .status(403)
                .json({ message: "Only admins can view other users' reservations" });
        }

        const reservations = await Reservation.find({ userId })
            .populate("hotelId", "name photos")
            .populate("userId", "username");

        res.status(200).json(reservations);
    } catch (err) {
        next(err);
    }
};

// Request cancel (User)
export const requestCancelReservation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const reservation = await Reservation.findOne({ _id: id, userId });
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        if (reservation.status !== "confirmed") {
            return res
                .status(400)
                .json({ message: `Cannot request cancellation for ${reservation.status}` });
        }

        reservation.status = "cancel_requested";
        reservation.cancellationRequestedAt = new Date();
        await reservation.save();

        res.status(200).json(reservation);
    } catch (err) {
        next(err);
    }
};

// Approve cancel (Admin)
export const approveCancelReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        if (reservation.status !== "cancel_requested") {
            return res
                .status(400)
                .json({ message: "Reservation is not pending cancellation" });
        }

        for (const { roomId, number } of reservation.roomDetails) {
            await Room.updateOne(
                { _id: roomId, "roomNumbers.number": number },
                {
                    $pull: {
                        "roomNumbers.$.unavailableDates": {
                            $in: reservation.dates.map((d) => new Date(d)),
                        },
                    },
                }
            );
        }

        reservation.status = "cancelled";
        await reservation.save();

        res.status(200).json(reservation);
    } catch (err) {
        next(err);
    }
};

// Reject cancel (Admin)
export const rejectCancelReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updated = await Reservation.findByIdAndUpdate(
            id,
            { status: "confirmed", cancellationRequestedAt: null },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};
