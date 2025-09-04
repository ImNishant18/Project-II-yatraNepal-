import mongoose from "mongoose";
import ExchangeCenter from "../models/ExchangeCenter.js";

// Helper: Check permission
const canModify = (user, center) =>
    user?.isAdmin || center.owner?.toString() === user.id;

// Helper: Distance in KM between two coords
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Convert Decimal128 fields to float for response
const convertDecimal128ToFloat = (center) => {
    if (!center) return center;
    const obj = center.toObject ? center.toObject() : center;
    if (obj.lat) obj.lat = parseFloat(obj.lat.toString());
    if (obj.lng) obj.lng = parseFloat(obj.lng.toString());
    return obj;
};

// 📥 Create Exchange Center with duplicate lat/lng check
export const createExchangeCenter = async (req, res, next) => {
    try {
        const { lat, lng, ...rest } = req.body;
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        // Tolerance for duplicates ~11 meters
        const tolerance = 0.0001;

        const existing = await ExchangeCenter.findOne({
            lat: {
                $gte: mongoose.Types.Decimal128.fromString((latNum - tolerance).toString()),
                $lte: mongoose.Types.Decimal128.fromString((latNum + tolerance).toString()),
            },
            lng: {
                $gte: mongoose.Types.Decimal128.fromString((lngNum - tolerance).toString()),
                $lte: mongoose.Types.Decimal128.fromString((lngNum + tolerance).toString()),
            },
            isActive: true,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: "An Exchange Center already exists very close to this location.",
            });
        }

        const data = {
            ...rest,
            owner: req.user.id,
            lat: mongoose.Types.Decimal128.fromString(latNum.toString()),
            lng: mongoose.Types.Decimal128.fromString(lngNum.toString()),
        };

        const center = new ExchangeCenter(data);
        const saved = await center.save();

        res.status(201).json({ success: true, data: convertDecimal128ToFloat(saved) });
    } catch (err) {
        next(err);
    }
};

// 📄 Get All Exchange Centers
export const getExchangeCenters = async (req, res, next) => {
    try {
        const { city, search, lat, lng, radius, limit = 50, page = 1, sort = "-createdAt" } = req.query;
        const query = { isActive: true };

        if (city && city !== "all") query.address = new RegExp(city, "i");
        if (search) {
            query.$or = [
                { name: new RegExp(search, "i") },
                { address: new RegExp(search, "i") },
                { services: new RegExp(search, "i") },
            ];
        }

        const skip = (page - 1) * limit;
        let centers = await ExchangeCenter.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean();

        // Filter by radius if lat, lng, radius provided
        if (lat && lng && radius) {
            centers = centers.filter((c) =>
                calculateDistance(+lat, +lng, parseFloat(c.lat), parseFloat(c.lng)) <= +radius
            );
        }

        const total = await ExchangeCenter.countDocuments(query);

        // Convert lat/lng Decimal128 to float
        centers = centers.map((c) => {
            c.lat = parseFloat(c.lat);
            c.lng = parseFloat(c.lng);
            return c;
        });

        res.status(200).json({
            success: true,
            count: centers.length,
            total,
            page: +page,
            pages: Math.ceil(total / limit),
            data: centers,
        });
    } catch (err) {
        next(err);
    }
};

// 🔍 Get Single Exchange Center
export const getExchangeCenter = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: "Invalid ID" });
        }

        const center = await ExchangeCenter.findById(id);
        if (!center || !center.isActive) {
            return res.status(404).json({ success: false, error: "Not found" });
        }

        res.status(200).json({ success: true, data: convertDecimal128ToFloat(center) });
    } catch (err) {
        next(err);
    }
};

// 🛠️ Update Exchange Center (optional: add duplicate check here too if desired)
export const updateExchangeCenter = async (req, res, next) => {
    try {
        const center = await ExchangeCenter.findById(req.params.id);
        if (!center) {
            return res.status(404).json({ success: false, error: "Not found" });
        }

        if (!canModify(req.user, center)) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        // Optional: check lat/lng duplicates on update if lat/lng is updated
        if (req.body.lat && req.body.lng) {
            const latNum = parseFloat(req.body.lat);
            const lngNum = parseFloat(req.body.lng);
            const tolerance = 0.0001;

            const existing = await ExchangeCenter.findOne({
                _id: { $ne: center._id }, // exclude current center
                lat: {
                    $gte: mongoose.Types.Decimal128.fromString((latNum - tolerance).toString()),
                    $lte: mongoose.Types.Decimal128.fromString((latNum + tolerance).toString()),
                },
                lng: {
                    $gte: mongoose.Types.Decimal128.fromString((lngNum - tolerance).toString()),
                    $lte: mongoose.Types.Decimal128.fromString((lngNum + tolerance).toString()),
                },
                isActive: true,
            });

            if (existing) {
                return res.status(400).json({
                    success: false,
                    error: "Another Exchange Center already exists very close to this location.",
                });
            }

            // Convert lat/lng to Decimal128 for update
            req.body.lat = mongoose.Types.Decimal128.fromString(latNum.toString());
            req.body.lng = mongoose.Types.Decimal128.fromString(lngNum.toString());
        }

        const updated = await ExchangeCenter.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });

        res.status(200).json({ success: true, data: convertDecimal128ToFloat(updated) });
    } catch (err) {
        next(err);
    }
};

// ❌ Soft Delete Exchange Center
export const deleteExchangeCenter = async (req, res, next) => {
    try {
        const center = await ExchangeCenter.findById(req.params.id);
        if (!center) {
            return res.status(404).json({ success: false, error: "Not found" });
        }

        if (!canModify(req.user, center)) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        center.isActive = false;
        await center.save();

        res.status(200).json({ success: true, message: "Exchange center deleted!" });
    } catch (err) {
        next(err);
    }
};

// 📍 Get Nearby Exchange Centers
export const getNearbyExchangeCenters = async (req, res, next) => {
    try {
        const { lat, lng, radius = 5 } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ success: false, error: "Latitude and longitude are required" });
        }

        const centers = await ExchangeCenter.find({
            isActive: true,
            lat: { $exists: true },
            lng: { $exists: true },
        }).lean();

        const nearbyCenters = centers.filter((c) =>
            calculateDistance(+lat, +lng, parseFloat(c.lat), parseFloat(c.lng)) <= +radius
        );

        res.status(200).json({ success: true, data: nearbyCenters });
    } catch (err) {
        next(err);
    }
};

// 📍 City-specific: Kathmandu, Lalitpur, Bhaktapur
const getCityCenters = (cityName) => async (req, res, next) => {
    try {
        const { search, lat, lng, radius, limit = 50, page = 1, sort = "-createdAt" } = req.query;
        const query = { isActive: true, address: new RegExp(cityName, "i") };

        if (search) {
            query.$or = [
                { name: new RegExp(search, "i") },
                { address: new RegExp(search, "i") },
                { services: new RegExp(search, "i") },
            ];
        }

        const skip = (page - 1) * limit;
        let centers = await ExchangeCenter.find(query).sort(sort).limit(limit).skip(skip).lean();

        if (lat && lng && radius) {
            centers = centers.filter((c) =>
                calculateDistance(+lat, +lng, parseFloat(c.lat), parseFloat(c.lng)) <= +radius
            );
        }

        const total = await ExchangeCenter.countDocuments(query);

        centers = centers.map(convertDecimal128ToFloat);

        res.status(200).json({
            success: true,
            count: centers.length,
            total,
            page: +page,
            pages: Math.ceil(total / limit),
            data: centers,
        });
    } catch (err) {
        next(err);
    }
};

export const getKathmanduExchangeCenters = getCityCenters("Kathmandu");
export const getLalitpurExchangeCenters = getCityCenters("Lalitpur");
export const getBhaktapurExchangeCenters = getCityCenters("Bhaktapur");