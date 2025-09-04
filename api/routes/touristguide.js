import express from "express";
import {
    createTouristGuide,
    updateTouristGuide,
    deleteTouristGuide,
    getTouristGuide,
    getAllTouristGuides,
    bookTouristGuide,
    cancelBookingByUser,
    getUserBookings,
    getGuideBookings,
    getUnavailableGuides
} from "../controllers/touristguide.js";

import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();


// Create, update, delete
router.post("/", verifyUser, createTouristGuide);              
router.put("/:id", verifyUser, updateTouristGuide);           
router.delete("/:id", verifyUser, deleteTouristGuide);        

router.get("/unavailable/all", getUnavailableGuides);         

// Fetch one or all
router.get("/:id", getTouristGuide);                          
router.get("/", getAllTouristGuides);                         

// Booking routes
router.post("/book/:id", bookTouristGuide);
router.put("/cancel/:bookingId", verifyUser, cancelBookingByUser);
router.get("/bookings/user/:userId", verifyUser, getUserBookings);
router.get("/bookings/guide/:guideId", verifyUser, getGuideBookings);

export default router;
