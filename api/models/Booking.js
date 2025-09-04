import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: "TouristGuide", required: true },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v >= new Date().setHours(0, 0, 0, 0);
            },
            message: "Start date cannot be in the past",
        },
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v >= this.startDate;
            },
            message: "End date cannot be before start date",
        },
    },
    groupSize: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    paymentMethod: {
        type: String,
        enum: ["esewa", "khalti", "cash"],
        required: true,
    },
    specialRequests: { type: String },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancel-requested", "cancelled", "completed"],
        default: "confirmed",
    },
    cancellationReason: { type: String },
    cancelledBy: { type: String, enum: ["user", "guide"], default: null },
    createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ userId: 1, guideId: 1, startDate: 1 });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;