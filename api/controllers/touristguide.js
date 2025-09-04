import TouristGuide from "../models/touristguide.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";

const licenseNumberPattern = /^TCB\/TG\([A-Z/_]+\)-\d{2}\/\d{4,5}$/;

// Create a tourist guide
export const createTouristGuide = async (req, res, next) => {
    try {
        let user;
        if (req.body.email) {
            user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(404).json({ message: "User with this email not found." });
        } else {
            user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: "User not found." });
        }

        const { name, img, location, language, experience, contactNumber, licenseNumber, category, pricePerDay, maxGroupSize } = req.body;

        const missingFields = [];
        if (!language) missingFields.push("language");
        if (experience == null) missingFields.push("experience");
        if (!contactNumber) missingFields.push("contactNumber");
        if (!licenseNumber) missingFields.push("licenseNumber");
        if (!category || category.length === 0) missingFields.push("category");
        if (pricePerDay == null) missingFields.push("pricePerDay");

        if (missingFields.length > 0) return res.status(400).json({ message: `Missing fields: ${missingFields.join(", ")}` });
        if (!licenseNumberPattern.test(licenseNumber)) return res.status(400).json({ message: "Invalid license number format." });

        const existingGuide = await TouristGuide.findOne({ $or: [{ userId: user._id }, { licenseNumber }] });
        if (existingGuide) return res.status(400).json({ message: "User is already registered as a tourist guide." });

        if (user.role !== "tourist guide") {
            user.role = "tourist guide";
            await user.save();
        }

        const newGuide = new TouristGuide({
            userId: user._id,
            name: name || user.username || "",
            email: user.email,
            img: img || user.img || "",
            location: location || user.city || user.country || "",
            language,
            experience,
            contactNumber,
            licenseNumber,
            category,
            pricePerDay,
            maxGroupSize: maxGroupSize || 5,
        });

        const savedGuide = await newGuide.save();
        res.status(201).json(savedGuide);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "Duplicate entry detected.", error: err.keyValue });
        next(err);
    }
};

// Update a guide
export const updateTouristGuide = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid guide ID" });

        delete req.body.userId;
        delete req.body.email;

        if (req.body.licenseNumber && !licenseNumberPattern.test(req.body.licenseNumber))
            return res.status(400).json({ message: "Invalid license number format." });

        const updated = await TouristGuide.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Guide not found." });

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// Delete a guide
export const deleteTouristGuide = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid guide ID" });

        const deleted = await TouristGuide.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Guide not found." });

        res.status(200).json({ message: "Tourist guide deleted successfully." });
    } catch (err) {
        next(err);
    }
};

// Get a single guide
export const getTouristGuide = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid guide ID" });

        const guide = await TouristGuide.findById(id).populate("userId", "username role");
        if (!guide) return res.status(404).json({ message: "Guide not found." });

        res.status(200).json(guide);
    } catch (err) {
        next(err);
    }
};

// Get all guides
export const getAllTouristGuides = async (req, res, next) => {
    try {
        const guides = await TouristGuide.find().populate("userId", "username role");
        if (!guides.length) return res.status(404).json({ message: "No tourist guides found." });

        res.status(200).json(guides);
    } catch (err) {
        next(err);
    }
};

// Book a guide
export const bookTouristGuide = async (req, res, next) => {
    try {
        const { id } = req.params; // guide id
        const { userId, startDate, endDate, groupSize, paymentMethod, specialRequests, totalPrice } = req.body;

        if (!isValidObjectId(id) || !isValidObjectId(userId))
            return res.status(400).json({ message: "Invalid IDs" });

        const guide = await TouristGuide.findById(id);
        if (!guide) return res.status(404).json({ message: "Guide not found." });
        if (!guide.isAvailable) return res.status(400).json({ message: "Guide is currently unavailable." });
        if (groupSize > guide.maxGroupSize)
            return res.status(400).json({ message: `Group size exceeds max allowed: ${guide.maxGroupSize}` });

        // Check if the guide is already booked for these dates
        const existingBooking = await Booking.findOne({
            guideId: id,
            status: "confirmed",
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ 
                message: "Guide is already booked for the selected dates." 
            });
        }

        const booking = new Booking({
            userId,
            guideId: guide._id,
            startDate,
            endDate,
            groupSize,
            totalPrice,
            paymentMethod,
            status: "confirmed",
            specialRequests
        });
        await booking.save();

        const activeBookings = await Booking.countDocuments({ 
            guideId: id, 
            status: "confirmed",
            endDate: { $gte: new Date() }
        });
        
        if (activeBookings > 0) {
            guide.isAvailable = false;
            await guide.save();
        }

        res.status(201).json({ message: "Guide booked successfully.", booking });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        next(err);
    }
};

// Cancel booking
export const cancelBookingByUser = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { reason } = req.body;

        if (!isValidObjectId(bookingId))
            return res.status(400).json({ message: "Invalid booking ID" });

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found." });

        if (booking.status !== "confirmed")
            return res.status(400).json({ message: "Only confirmed bookings can be cancelled." });

        booking.status = "cancelled";
        booking.cancelledBy = "user";
        booking.cancellationReason = reason || "No reason provided";
        await booking.save();

        // Check if the guide should be marked as available again
        const activeBookings = await Booking.countDocuments({ 
            guideId: booking.guideId, 
            status: "confirmed",
            endDate: { $gte: new Date() }
        });
        
        if (activeBookings === 0) {
            const guide = await TouristGuide.findById(booking.guideId);
            if (guide) {
                guide.isAvailable = true;
                await guide.save();
            }
        }

        res.status(200).json({ message: "Booking cancelled successfully.", booking });
    } catch (err) {
        next(err);
    }
};

// Get user bookings
export const getUserBookings = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!isValidObjectId(userId))
            return res.status(400).json({ message: "Invalid user ID" });

        const bookings = await Booking.find({ userId })
            .populate("guideId", "name location pricePerDay isAvailable")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

// Get guide bookings
export const getGuideBookings = async (req, res, next) => {
    try {
        const { guideId } = req.params;
        if (!isValidObjectId(guideId))
            return res.status(400).json({ message: "Invalid guide ID" });

        const bookings = await Booking.find({ guideId })
            .populate("userId", "username email contactNumber")
            .populate("guideId", "name location pricePerDay")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

// Get all unavailable guides
export const getUnavailableGuides = async (req, res, next) => {
    try {
        const guides = await TouristGuide.find({ isAvailable: false }).populate("userId", "username role");
        if (!guides.length) return res.status(404).json({ message: "No unavailable tourist guides found." });
        res.status(200).json(guides);
    } catch (err) {
        next(err);
    }
};
