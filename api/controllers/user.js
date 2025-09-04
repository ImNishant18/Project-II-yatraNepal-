import User from '../models/User.js';
import { createError } from '../utils/error.js';

// GET ALL USERS (Admin only)
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

// GET SINGLE USER (Self or Admin)
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return next(createError(404, 'User not found'));
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

// UPDATE USER (Self or Admin)
export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return next(createError(404, 'User not found'));
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

// DELETE USER (Self or Admin)
export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return next(createError(404, 'User not found'));
        res.status(200).json({ message: 'User has been deleted.' });
    } catch (err) {
        next(err);
    }
};

// Controller to get user role by ID
export const getUserRole = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).select("role username email"); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};