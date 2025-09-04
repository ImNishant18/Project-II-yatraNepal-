import express from "express";
import {
    createReservation,
    getUserReservations,
    requestCancelReservation,
    approveCancelReservation,
    rejectCancelReservation,
    getReservations,
    getReservationById
} from "../controllers/reservation.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


// User routes
router.post("/", verifyUser, createReservation);
router.get("/user", verifyUser, getUserReservations);
router.get("/:reservationId", verifyUser, getReservationById); 
router.put("/:id/request-cancel", verifyUser, requestCancelReservation);

// Admin routes
router.get("/", verifyAdmin, getReservations);
router.put("/:id/approve-cancel", verifyAdmin, approveCancelReservation);
router.put("/:id/reject-cancel", verifyAdmin, rejectCancelReservation);

export default router;