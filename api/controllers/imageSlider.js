import ImagesSlider from "../models/Imageslider.js";

export const createSliderImage = async (req, res) => {
    try {
        const { name, imageType, imagePath } = req.body;

        if (!name || !imageType || !imagePath) {
            return res.status(400).json({ error: "Name, imageType and imagePath are required." });
        }

        if (!["image/jpeg", "image/png"].includes(imageType)) {
            return res.status(400).json({ error: "Invalid image type." });
        }
        
        const newImage = new ImagesSlider({ name, imageType, imagePath });
        await newImage.save();

        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllSliderImages = async (req, res) => {
    try {
        const images = await ImagesSlider.find().sort({ createdAt: -1 });
        res.json(images);
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

export const getSliderImage = async (req, res) => {
    try {
        const image = await ImagesSlider.findById(req.params.id);
        if (!image) return res.status(404).json({ error: "Image not found" });
        res.json(image);
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

export const updateSliderImage = async (req, res) => {
    try {
        const image = await ImagesSlider.findById(req.params.id);
        if (!image) return res.status(404).json({ error: "Image not found" });

        const { name, imageType, imagePath } = req.body;

        if (name) image.name = name;
        if (imageType) {
            if (!["image/jpeg", "image/png"].includes(imageType)) {
                return res.status(400).json({ error: "Invalid image type." });
            }
            image.imageType = imageType;
        }
        if (imagePath) image.imagePath = imagePath;

        await image.save();
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSliderImage = async (req, res) => {
    try {
        const image = await ImagesSlider.findByIdAndDelete(req.params.id);
        if (!image) return res.status(404).json({ error: "Image not found" });
        res.json({ message: "Image deleted successfully" });
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};
