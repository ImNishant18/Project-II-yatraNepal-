import Place from "../models/Place.js";
// Utility: Calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Create a new place
export const createPlace = async (req, res) => {
    try {
        const place = new Place(req.body);
        await place.save();
        res.status(201).json({
            success: true,
            data: place
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get all places with advanced filtering
export const getAllPlaces = async (req, res) => {
    try {
        const { 
            search,
            city,
            category,
            lat,
            lng,
            radius,
            limit = 50,
            page = 1,
            sort = '-createdAt'
        } = req.query;

        const query = {};
        
        // Search across multiple fields
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by city
        if (city && city !== 'all') {
            query.city = new RegExp(`^${city}$`, 'i');
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        const skip = (page - 1) * limit;
        const total = await Place.countDocuments(query);
        
        let places = await Place.find(query)
            .sort(sort)
            .limit(+limit)
            .skip(skip)
            .lean();

        // Apply radius filter if coordinates provided
        if (lat && lng && radius) {
            places = places.filter((place) => {
                if (!place.location?.coordinates) return false;
                const distance = calculateDistance(
                    parseFloat(lat),
                    parseFloat(lng),
                    place.location.coordinates[1],
                    place.location.coordinates[0]
                );
                return distance <= parseFloat(radius);
            });
        }

        res.status(200).json({
            success: true,
            count: places.length,
            total,
            page: +page,
            pages: Math.ceil(total / limit),
            data: places,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get a single place by ID
export const getPlaceById = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ 
                success: false,
                error: 'Place not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: place
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Update a place
export const updatePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!place) {
            return res.status(404).json({ 
                success: false,
                error: 'Place not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: place
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Delete a place
export const deletePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) {
            return res.status(404).json({ 
                success: false,
                error: 'Place not found' 
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Place deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get places by category
export const getPlacesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ['Cultural', 'Natural', 'Historical', 'Adventure', 'Religious', 'Food Destinations', 'Photography'];
        
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const places = await Place.find({ category });
        res.status(200).json({
            success: true,
            count: places.length,
            data: places
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = [
            'Cultural', 'Natural', 'Historical', 
            'Adventure', 'Religious', 
            'Food Destinations', 'Photography'
        ];
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};