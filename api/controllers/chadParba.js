import ChadParba from "../models/chadParba.js";
import mongoose from "mongoose";

// CREATE a new ChadParba
export const createEvent = async (req, res) => {
    try {
        const chadParba = new ChadParba(req.body);
        await chadParba.save();
        res.status(201).json(chadParba);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// READ all ChadParba
export const getAllEvents = async (req, res) => {
    try {
        const chadParbas = await ChadParba.find().sort({ nepaliMonth: 1, nepaliDay: 1 });
        res.json(chadParbas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ a single ChadParba by ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }

        const chadParba = await ChadParba.findById(id);

        if (!chadParba) {
            return res.status(404).json({ error: "ChadParba not found" });
        }

        res.json(chadParba);
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.status(500).json({ error: error.message });  // send real message
    }
};

// UPDATE a ChadParba by ID
export const updateEvent = async (req, res) => {
    try {
        const updatedChadParba = await ChadParba.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedChadParba) return res.status(404).json({ error: "ChadParba not found" });
        res.json(updatedChadParba);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE a ChadParba by ID
export const deleteEvent = async (req, res) => {
    try {
        const deletedChadParba = await ChadParba.findByIdAndDelete(req.params.id);
        if (!deletedChadParba) return res.status(404).json({ error: "ChadParba not found" });
        res.json({ message: "ChadParba deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET all ChadParba for a specific Nepali month
export const getEventsByMonth = async (req, res) => {
    try {
        const { month } = req.params;

        const validMonths = [
            "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
            "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
        ];

        if (!validMonths.includes(month)) {
            return res.status(400).json({ error: "Invalid Nepali month" });
        }

        const chadParbas = await ChadParba.find({ nepaliMonth: month }).sort({ nepaliDay: 1 });
        res.json(chadParbas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};