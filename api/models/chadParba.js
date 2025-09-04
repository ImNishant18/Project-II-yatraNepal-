import mongoose from "mongoose";

const chadParbaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    nepaliMonth: {
        type: String,
        required: true,
        enum: [
            "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
            "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
        ],
    },

    nepaliDay: {
        type: Number,
        required: true,
        min: 1,
        max: 32,
    },
    category: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model("ChadParba", chadParbaSchema);