import express from "express";
import {
    getExchangeCenters,
    getExchangeCenter,
    createExchangeCenter,
    updateExchangeCenter,
    deleteExchangeCenter,
    getNearbyExchangeCenters,
    getKathmanduExchangeCenters,
    getLalitpurExchangeCenters,
    getBhaktapurExchangeCenters,
} from "../controllers/exchangeController.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", getExchangeCenters);
router.get("/nearby", getNearbyExchangeCenters);   // specific before dynamic
router.get("/kathmandu", getKathmanduExchangeCenters);
router.get("/lalitpur", getLalitpurExchangeCenters);
router.get("/bhaktapur", getBhaktapurExchangeCenters);

router.get("/:id", getExchangeCenter);  // dynamic route last

router.post("/", verifyUser, createExchangeCenter);
router.put("/:id", verifyUser, updateExchangeCenter);
router.delete("/:id", verifyUser, deleteExchangeCenter);

export default router;