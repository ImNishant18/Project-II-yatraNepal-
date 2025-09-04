import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    reviewedItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'reviewedModel',
    },
    
    reviewedModel: {
        type: String,
        required: true,
        enum: ['Place', 'Hotel', 'ExchangeCenter', 'TouristGuide'],
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    comment: {
        type: String,
        trim: true,
    },

}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
