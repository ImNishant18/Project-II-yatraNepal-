import express from "express";
import {
    initiateEsewaPayment,
    verifyEsewaPayment,
    getPaymentStatus,
    initiateKhaltiPayment,
    verifyKhaltiPayment,
    processCashPayment
} from "../controllers/payment.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Payment routes
router.post("/esewa/initiate", verifyUser, initiateEsewaPayment);
router.get("/esewa/verify", verifyEsewaPayment);
router.post("/khalti/initiate", verifyUser, initiateKhaltiPayment);
router.get("/khalti/verify", verifyKhaltiPayment);
router.post("/cash/process", verifyUser, processCashPayment); 
router.get("/status/:reservationId", verifyUser, getPaymentStatus);

export default router;