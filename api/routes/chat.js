import express from "express";
import { createChat, getUserChats } from "../controllers/chat.js";

const router = express.Router();

router.post("/", createChat);            
router.get("/:userId", getUserChats);    

export default router;