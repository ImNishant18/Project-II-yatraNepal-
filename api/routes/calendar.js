// routes/calendar.js

import express from 'express';
import {
    getMonth,
    getDay,
    getHolidays,
    getEvents,
    getTodayNepaliDate,
    getCompleteCalendar
} from '../controllers/calendar.js';

const router = express.Router();

// Static/specific routes first
router.get('/calendar/today', getTodayNepaliDate);

// GET complete calendar for a specific year
router.get('/calendar/:year', getCompleteCalendar);
// Event and holiday queries by year/month (specific before general)
router.get('/:year/:month/holidays', getHolidays);
router.get('/:year/holidays', getHolidays);

router.get('/:year/:month/events', getEvents);
router.get('/:year/events', getEvents);

// Dynamic calendar data routes (these go last!)
router.get('/:year/:month/:day', getDay);
router.get('/:year/:month', getMonth);

export default router;
