import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();

// REGISTER
export const register = async (req, res, next) => {
    try {
        const { username, email, password, phone, city, country, img, role } = req.body;

        // Validate required fields
        if (!username || !email || !password || !phone || !city || !country) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists." });
        }

        // Create new user (password will be hashed by pre-save hook)
        const newUser = new User({
            username,
            email,
            password,
            phone,
            city,
            country,
            img: img || "",
            role: role || "user",
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (err) {
        next(err);
    }
};

// LOGIN
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign(
            { id: user._id.toString(), isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: pwd, isAdmin, ...otherDetails } = user._doc;

        res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .status(200)
            .json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        next(err);
    }
};

// CHECK AUTH
export const checkAuth = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ isAuthenticated: false });

        res.status(200).json({
            isAuthenticated: true,
            userId: user.id,
            isAdmin: user.isAdmin,
        });
    });
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(createError(404, "User not found with this email"));

        // Generate token
        const token = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Compose reset link (update URL for your frontend)
        const resetUrl = `http://localhost:3000/reset-password/${token}`;

        const message = `
      You requested a password reset.
      Click the link below to reset your password:
      ${resetUrl}
      
      If you did not request this, please ignore this email.
    `;

        await sendEmail(user.email, "Password Reset Request", message);

        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (err) {
        next(err);
    }
};

// RESET PASSWORD
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return next(createError(400, "Invalid or expired password reset token"));

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.status(200).json({ message: "Password reset successful." });
    } catch (err) {
        next(err);
    }
};
