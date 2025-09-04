import express from "express";
import {
    createSliderImage,
    deleteSliderImage,
    getAllSliderImages,
    getSliderImage,
    updateSliderImage,
} from "../controllers/imageSlider.js";

const router = express.Router();

router.post("/", createSliderImage);
router.get("/", getAllSliderImages);
router.get("/:id", getSliderImage);
router.put("/:id", updateSliderImage);
router.delete("/:id", deleteSliderImage);

export default router;