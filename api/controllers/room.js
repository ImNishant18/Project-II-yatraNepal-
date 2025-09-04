import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

// Create
export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoomData = {
        ...req.body,
        hotel: hotelId,  // add this line
    };
    const newRoom = new Room(newRoomData);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
};

// Update
export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedRoom);
    } catch (err) {
        next(err);
    }
}

export const updateRoomAvailability = async (req, res, next) => {
    try {
        const roomNumberId = req.params.id;
        const datesToAdd = req.body.dates;

        if (!roomNumberId) {
            return res.status(400).json({ message: "Room number ID is required." });
        }

        if (!datesToAdd || !Array.isArray(datesToAdd) || datesToAdd.length === 0) {
            return res.status(400).json({ message: "Dates array is required." });
        }

        const result = await Room.updateOne(
            { "roomNumbers._id": roomNumberId },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": { $each: datesToAdd },
                },
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Room number not found or dates already booked." });
        }

        res.status(200).json({ message: "Room availability has been updated." });
    } catch (err) {
        next(err);
    }
};
// Delete
export const deleteRoom = async (req, res, next) => {
    try {
        // Find the room first
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: "Room not found" });

        // Use correct property to get hotelId
        const hotelId = room.hotel;

        // Delete the room
        await Room.findByIdAndDelete(req.params.id);

        // Remove the room reference from the hotel document
        await Hotel.findByIdAndUpdate(hotelId, {
            $pull: { rooms: req.params.id },
        });

        res.status(200).json("Room has been deleted.");
    } catch (err) {
        next(err);
    }
};


// Get
export const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
}

// Get All 
export const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
}