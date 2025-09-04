import mongoose from "mongoose";
import Review from "../models/Review.js";

const allowedModels = ['Place', 'Hotel', 'ExchangeCenter', 'TouristGuide'];

// Create a new review
export const createReview = async (req, res, next) => {
    try {
        const { reviewedItem, reviewedModel, rating, comment } = req.body;
        const userId = req.user.id;

        if (!allowedModels.includes(reviewedModel)) {
            return res.status(400).json({ message: "Invalid reviewed model type." });
        }
        const newReview = new Review({
            userId,
            reviewedItem,
            reviewedModel,
            rating,
            comment,
        });

        await newReview.save();
        res.status(201).json({ success: true, review: newReview });
    } catch (err) {
        next(err);
    }
};

// Get all reviews for a specific model
export const getReviewsByModel = async (req, res) => {
    try {
        const { model } = req.params;

        if (!allowedModels.includes(model)) {
            return res.status(400).json({ message: "Invalid model type." });
        }

        const reviews = await Review.find({ reviewedModel: model })
            .populate("userId", "username email")
            .populate("reviewedItem", "name");

        res.status(200).json(reviews);
    } catch (err) {
        console.error("Get Reviews by Model Error:", err);
        res.status(500).json({ message: "Failed to fetch model reviews." });
    }
};

// Get all reviews submitted by a user
export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        const userReviews = await Review.find({ userId })
            .populate("reviewedItem", "name city")
            .sort({ createdAt: -1 });

        const filtered = userReviews.filter(r => allowedModels.includes(r.reviewedModel));

        res.status(200).json(filtered);
    } catch (err) {
        console.error("Get User Reviews Error:", err);
        res.status(500).json({ message: "Failed to fetch user reviews." });
    }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review
            .find()
            .populate("userId", "username email")
            .populate("reviewedItem", "name city")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (err) {
        console.error("Get All Reviews Error:", err);
        res.status(500).json({ message: "Failed to fetch all reviews." });
    }
};

// Get average rating for a specific item
export const getAverageRating = async (req, res) => {
    try {
        const { model, id } = req.params;

        if (!allowedModels.includes(model)) {
            return res.status(400).json({ message: "Invalid model type." });
        }

        const result = await Review.aggregate([
            {
                $match: {
                    reviewedModel: model,
                    reviewedItem: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        if (result.length === 0) {
            return res.status(200).json({ averageRating: 0, totalReviews: 0 });
        }

        res.status(200).json(result[0]);
    } catch (err) {
        console.error("Get Avg Rating Error:", err);
        res.status(500).json({ message: "Failed to get average rating." });
    }
};

// Delete a review by ID
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }

        // Only the review owner or an admin can delete
        if (req.user.id !== review.userId.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete this review." });
        }

        await Review.findByIdAndDelete(id);
        res.status(200).json({ message: "Review deleted." });
    } catch (err) {
        console.error("Delete Review Error:", err);
        res.status(500).json({ message: "Failed to delete review." });
    }
};

// Update a review by ID
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedReview);
    } catch (err) {
        console.error("Update Review Error:", err);
        res.status(500).json({ message: "Failed to update review." });
    }
};

// controllers/review.js
export const getReviewsByModelAndId = async (req, res) => {
    try {
        const { model, id } = req.params;

        const reviews = await Review.find({
            modelType: model,
            itemId: id
        })
            .populate('userId', 'username profilePicture')
            .sort({ createdAt: -1 });

        const formattedReviews = reviews.map(review => ({
            _id: review._id,
            username: review.userId?.username || 'Deleted User',
            rating: review.rating,
            comment: review.comment,
            reviewedDate: review.createdAt,
            profilePicture: review.userId?.img || null
        }));

        res.status(200).json(formattedReviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};