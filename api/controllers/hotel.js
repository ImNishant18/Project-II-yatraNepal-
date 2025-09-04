import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

// Create
export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);

    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }

}
// Update
export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedHotel);
    } catch (err) {
        next(err);
    }

}
// Delete
export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json('Hotel has been deleted.');
    } catch (err) {
        next(err);
    }
}

// Get
export const getHotel = async (req, res, next) => {
    try {
        console.log("Requested hotel ID:", req.params.id);
        const hotel = await Hotel.findById(req.params.id);
        console.log("Hotel found:", hotel);

        if (!hotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }

        res.status(200).json(hotel);
    } catch (err) {
        next(err);
    }
};

// Get All
export const getHotels = async (req, res, next) => {
    const { min = 1000, max = 15999, limit, ...others } = req.query;

    try {
        const hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gte: parseInt(min), $lte: parseInt(max) },
        }).limit(parseInt(limit) || 0);

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

// Count by City
export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");

    try {
        const list = await Promise.all(
            cities.map(city => Hotel.countDocuments({ city: city }))
        );
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};

// Count by Type
export const countByType = async (req, res, next) => {
    try {
        const counts = await Hotel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: 1
                }
            }
        ]);
        res.status(200).json(counts);
    } catch (err) {
        next(err);
    }
};

// Get Rooms

export const getHotelRooms = async (req, res, next) => {
    try {
        // Populate rooms field to get full room documents
        const hotel = await Hotel.findById(req.params.id).populate("rooms");

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        // Return full rooms array
        res.status(200).json(hotel.rooms);
    } catch (err) {
        next(err);
    }
};


// Get Booked Rooms by specific user
export const getBookedRooms = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!Array.isArray(user.bookings) || user.bookings.length === 0) {
            return res.status(200).json([]); // Return empty list if no bookings
        }

        const bookedRooms = await Promise.all(
            user.bookings.map(roomId => Room.findById(roomId))
        );

        // Filter out null values (in case rooms were deleted)
        const validRooms = bookedRooms.filter(room => room !== null);

        res.status(200).json(validRooms);
    } catch (err) {
        next(err);
    }
};