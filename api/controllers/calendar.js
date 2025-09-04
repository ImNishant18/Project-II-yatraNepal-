import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createError } from '../utils/error.js';
import { fromDevanagari } from '../utils/convertFromDevanagari.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const loadJSON = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error(`Failed to load data: ${err.message}`);
    }
};
const isValidCalendarRequest = (year, month = null) => {
    if (!year || year.length !== 4) {
        return false;
    }
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 3000) {
        return false;
    }
    if (month) {
        const monthNum = parseInt(month);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return false;
        }
    }
    
    return true;
};

// GET COMPLETE CALENDAR FOR A YEAR
export const getCompleteCalendar = async (req, res, next) => {
    try {
        const { year } = req.params;
        
        if (!isValidCalendarRequest(year)) {
            return next();
        }
        
        const yearDir = path.join(DATA_DIR, year);
        try {
            await fs.access(yearDir);
        } catch (err) {
            return next(createError(404, 'Year data not found'));
        }

        const files = (await fs.readdir(yearDir))
            .filter(f => f.endsWith('.json'))
            .sort((a, b) => {
                const monthA = parseInt(a.split('.')[0]);
                const monthB = parseInt(b.split('.')[0]);
                return monthA - monthB;
            });
        const calendarData = {};
        for (const file of files) {
            const monthNumber = parseInt(file.split('.')[0]);
            const monthData = await loadJSON(path.join(yearDir, file));
            calendarData[monthNumber] = monthData;
        }

        res.status(200).json({
            year,
            months: Object.keys(calendarData).length,
            data: calendarData
        });
    } catch (err) {
        next(err);
    }
};

// GET MONTH DATA - FIXED WITH VALIDATION
export const getMonth = async (req, res, next) => {
    try {
        const { year, month } = req.params;
        
        if (!isValidCalendarRequest(year, month)) {
            return next(); 
        }

        const filePath = path.join(DATA_DIR, year, `${parseInt(month)}.json`);
        const data = await loadJSON(filePath);
        res.status(200).json(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next();
        }
        next(err);
    }
};

// GET SPECIFIC DAY - FIXED WITH VALIDATION
export const getDay = async (req, res, next) => {
    try {
        const { year, month, day } = req.params;
        if (!isValidCalendarRequest(year, month)) {
            return next(); 
        }
        const dayNum = parseInt(day);
        if (isNaN(dayNum) || dayNum < 1 || dayNum > 32) {
            return next();
        }

        const filePath = path.join(DATA_DIR, year, `${parseInt(month)}.json`);
        
        try {
            await fs.access(filePath);
        } catch (err) {
            return next();
        }
        
        const monthData = await loadJSON(filePath);

        const dayStr = day.toString();

        const dayData = monthData.find(d => {
            const normalizedNp = fromDevanagari(d.np.toString());
            return normalizedNp === dayStr;
        });

        if (!dayData) return next(createError(404, 'Day not found'));

        res.status(200).json(dayData);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next();
        }
        next(err);
    }
};

// GET HOLIDAYS - FIXED WITH VALIDATION
export const getHolidays = async (req, res, next) => {
    try {
        const { year, month } = req.params;
        
        if (!isValidCalendarRequest(year, month || '1')) {
            return next();
        }
        
        let holidays = [];

        if (month) {
            const filePath = path.join(DATA_DIR, year, `${parseInt(month)}.json`);
            const monthData = await loadJSON(filePath);
            holidays = monthData.filter(day => day.isholiday);
        } else {
            const yearDir = path.join(DATA_DIR, year);
            const files = (await fs.readdir(yearDir)).filter(f => f.endsWith('.json'));
            for (const file of files) {
                const monthData = await loadJSON(path.join(yearDir, file));
                holidays.push(...monthData.filter(day => day.isholiday));
            }
        }

        res.status(200).json({ count: holidays.length, holidays });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next();
        }
        next(err);
    }
};

// GET EVENTS - FIXED WITH VALIDATION
export const getEvents = async (req, res, next) => {
    try {
        const { year, month } = req.params;
        
        if (!isValidCalendarRequest(year, month || '1')) {
            return next();
        }
        
        let events = [];

        if (month) {
            const filePath = path.join(DATA_DIR, year, `${parseInt(month)}.json`);
            const monthData = await loadJSON(filePath);
            events = monthData.filter(day => day.event && day.event.trim() !== '');
        } else {
            const yearDir = path.join(DATA_DIR, year);
            const files = (await fs.readdir(yearDir)).filter(f => f.endsWith('.json'));
            for (const file of files) {
                const monthData = await loadJSON(path.join(yearDir, file));
                events.push(...monthData.filter(day => day.event && day.event.trim() !== ''));
            }
        }

        res.status(200).json({ count: events.length, events });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next();
        }
        next(err);
    }
};

// GET TODAY'S DATE - FIXED WITH VALIDATION
export const getTodayNepaliDate = async (req, res, next) => {
    try {
        if (Object.keys(req.params).length > 0) {
            return next();
        }

        const today = new Date();

        const todayFormatted = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).trim();

        // Get all available Nepali year directories
        const yearDirs = await fs.readdir(DATA_DIR);
        const validYears = yearDirs.filter(name => /^\d{4}$/.test(name)); 
        for (const year of validYears) {
            const yearPath = path.join(DATA_DIR, year);

            for (let month = 1; month <= 12; month++) {
                const filePath = path.join(yearPath, `${month}.json`);

                try {
                    const fileData = await fs.readFile(filePath, 'utf-8');
                    const monthData = JSON.parse(fileData);

                    const match = monthData.find(
                        day => day.en_date.trim() === todayFormatted
                    );

                    if (match) {
                        return res.status(200).json({
                            success: true,
                            data: match
                        });
                    }
                } catch (err) {
                    continue;
                }
            }
        }
        return res.status(404).json({
            success: false,
            message: "Today's Nepali date not found in any year data."
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({
            success: false,
            message: "Failed to get today's Nepali date",
            error: err.message
        });
    }
};