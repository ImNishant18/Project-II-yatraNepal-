import mongoose from "mongoose";

const exchangeCenterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        lat: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            min: -90,
            max: 90,
        },
        lng: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            min: -180,
            max: 180,
        },
        images: {
            type: [String],
            default: [],
            validate: [arr => arr.length <= 3, "You can upload up to 3 images only"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        contactNumber: {
            type: String,
            required: true,
            trim: true,
            maxlength: 15,
            match: [/^[0-9+\-\s()]*$/, "Invalid contact number format"],
        },
        hours: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        services: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const ExchangeCenter = mongoose.models.ExchangeCenter || mongoose.model("ExchangeCenter", exchangeCenterSchema);
export default ExchangeCenter;