import mongoose from "mongoose";

const touristGuideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    img: String,
    location: { type: String, required: true },
    language: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    contactNumber: { type: String, required: true },
    licenseNumber: {
        type: String,
        required: true,
        match: [/^TCB\/TG\([A-Z/_]+\)-\d{2}\/\d{4,5}$/, "Invalid license number format"],
    },
    category: {
        type: [String],
        enum: ["Adventure","Cultural","Historical","Wildlife","Religious","Eco-tourism","Trekking","Local Experience"],
        required: true,
    },

    pricePerDay: { type: Number, required: true, min: 0 },
    maxGroupSize: { type: Number, default: 5, min: 1 },
    isAvailable: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now },
});

touristGuideSchema.index({ location: 1, isAvailable: 1 });

const TouristGuide =
    mongoose.models.TouristGuide || mongoose.model("TouristGuide", touristGuideSchema);

export default TouristGuide;
