// controllers/searchController.js
import Hotel from "../models/Hotel.js";
import Place from "../models/Place.js";
import TouristGuide from "../models/touristguide.js";
import ExchangeCenter from "../models/ExchangeCenter.js";

export const searchAllModels = async (req, res, next) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        const trimmedQuery = query.trim();
        const regex = new RegExp(trimmedQuery, "i");
        const limit = 10;

        console.log("Search regex:", regex);

        const [hotels, places, guides, exchanges] = await Promise.all([
            Hotel.find({
                $or: [{ name: regex }, { description: regex }, { location: regex }]
            }).limit(limit).lean(),

            Place.find({
                $or: [{ name: regex }, { description: regex }, { location: regex }]
            }).limit(limit).lean(),

            TouristGuide.find({
                $or: [{ name: regex }, { bio: regex }, { expertise: regex }]
            }).limit(limit).lean(),

            ExchangeCenter.find({
                $or: [{ name: regex }, { address: regex }]
            }).limit(limit).lean(),
        ]);

        const formattedHotels = hotels.map(item => ({ ...item, reviewedModel: "Hotel" }));
        const formattedPlaces = places.map(item => ({ ...item, reviewedModel: "Place" }));
        const formattedGuides = guides.map(item => ({ ...item, reviewedModel: "TouristGuide" }));
        const formattedExchanges = exchanges.map(item => ({ ...item, reviewedModel: "ExchangeCenter" }));

        const results = [
            ...formattedHotels,
            ...formattedPlaces,
            ...formattedGuides,
            ...formattedExchanges
        ];

        res.status(200).json(results);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server error during search" });
    }
};
