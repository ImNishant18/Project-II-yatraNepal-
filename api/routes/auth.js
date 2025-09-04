import express from "express";
import {
    checkAuth,
    forgotPassword,
    login,
    register,
    resetPassword
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/login", login);
router.get("/", checkAuth);

export default router;