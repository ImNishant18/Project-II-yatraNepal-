
import express from "express";
import { searchAllModels } from "../controllers/search.js";

const router = express.Router();

router.get("/", searchAllModels);

export default router;
