import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// Verify Token middleware
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    // Check token in Authorization header OR in cookies (access_token)
    const token = tokenFromHeader || req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // decoded contains { id, isAdmin }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

// Verify User middleware: user must be owner or admin
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        const paramId = req.params.id;
        const userId = req.params.userId; // Also check for userId parameter

        // If route uses :id or :userId, compare it — otherwise just allow logged-in users
        if ((!paramId && !userId) || req.user.id === paramId || req.user.id === userId || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "You are not authorized!" });
        }
    });
};

// Verify Admin middleware
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Admins only!" });
        }
    });
};

// Verify Role middleware: allows array of roles (assuming req.user.role exists)
export const verifyRole = (roles = []) => {
    return (req, res, next) => {
        verifyToken(req, res, () => {
            if (roles.includes(req.user.role)) {
                next();
            } else {
                return res.status(403).json({ message: "You are not authorized for this role!" });
            }
        });
    };
};