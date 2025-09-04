// routes/booking.js
import express from "express";
import { getBookedRooms } from "../controllers/booking.js";

const router = express.Router();

// Route: GET /api/bookings/booked-rooms/:userId
router.get("/booked-rooms/:userId", getBookedRooms);

export default router;

