import express from 'express';
import {
    countByCity,
    countByType,
    createHotel,
    deleteHotel,
    getHotel,
    getHotelRooms,
    getHotels,
    updateHotel
} from '../controllers/hotel.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// CREATE
router.post('/', verifyAdmin, createHotel);


// UPDATE
router.put('/:id', verifyAdmin, updateHotel);

// DELETE
router.delete('/:id', verifyAdmin, deleteHotel);

// Count by City
router.get('/countByCity', countByCity);

// Count by Type
router.get('/countByType', countByType);

// GET one
router.get('/:id', getHotel);
// GET all
router.get('/', getHotels);

// Get hotel rooms
router.get('/rooms/:id', getHotelRooms);

export default router;
