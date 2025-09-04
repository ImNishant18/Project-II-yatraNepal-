import express from "express";
import {
  createReview, deleteReview, getAllReviews,
  getAverageRating, getReviewsByModel, getUserReviews,
  getReviewsByModelAndId
} from "../controllers/review.js";
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// 1. Get all reviews
router.get("/", getAllReviews);

// 2. Get reviews by user
router.get("/user/:userId", verifyToken, getUserReviews);

// 3. Get reviews for a specific model type (all tourist guides)
router.get("/model/:model", getReviewsByModel);

// 4. NEW: Get reviews for a specific item (specific tourist guide)
router.get("/model/:model/:id", getReviewsByModelAndId);

// 5. Get average rating for a specific item
router.get("/:model/:id/average", getAverageRating);

// 6. Create a new review (protected)
router.post("/", verifyToken, createReview);

// 7. Delete a review (allow owner or admin)
router.delete("/:id", verifyToken, deleteReview);

export default router;