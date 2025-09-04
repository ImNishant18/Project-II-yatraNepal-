import express from "express";
import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    getEventsByMonth,
    updateEvent
} from "../controllers/chadParba.js";

const router = express.Router();


router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/month/:month", getEventsByMonth);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;