import express from "express";
import {
    createBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById,
    getUserBlogs,
    updateBlog
} from "../controllers/blog.js";

import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

// Create a new blog post

router.post("/", verifyToken, createBlog);
// Get all blogs
router.get("/", getAllBlogs);

// Get all blogs by a specific user
router.get("/user/:userId", getUserBlogs);

// Get a single blog by ID
router.get("/:id", getBlogById);

// Update a blog post
router.put("/:id", updateBlog);

// Delete a blog post
router.delete("/:id", deleteBlog);

export default router;
