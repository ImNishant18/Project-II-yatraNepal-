import express from "express";
import { esewaCallback } from "../controllers/esewaController.js";

const router = express.Router();

// POST callback from eSewa
router.post("/callback", esewaCallback);

export default router;
