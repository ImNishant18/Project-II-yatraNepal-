import User from "../models/User.js";
import Room from "../models/Room.js";
import Reservation from "../models/Reservation.js";

export const getBookedRooms = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const reservations = await Reservation.find({ userId })
            .populate({
                path: "roomIds",
                select: "title roomNumbers price maxPeople"
            })
            .populate({
                path: "hotelId",
                select: "name photos"
            });

        const formatted = reservations.map((reservation) => {
            const checkIn = new Date(reservation.dates[0]);
            const checkOut = new Date(reservation.dates[reservation.dates.length - 1]);
            const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

            return {
                reservation_id: reservation._id,
                status: reservation.status,
                total_price: reservation.totalPrice,
                total_days: totalNights,
                hotel: {
                    _id: reservation.hotelId?._id,
                    name: reservation.hotelId?.name || "Hotel Deleted",
                    photo: reservation.hotelId?.photos?.[0] || "",  // <- main photo
                },
                rooms: reservation.roomIds.map((room) => ({
                    _id: room._id,
                    title: room.title,
                    roomNumbers: room.roomNumbers.map((r) => r.number),
                    price: room.price,
                    maxPeople: room.maxPeople,
                }))
            };
        });

        res.status(200).json(formatted);
    } catch (err) {
        next(err);
    }
};