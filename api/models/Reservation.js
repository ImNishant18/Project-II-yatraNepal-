import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
            index: true,
        },
        roomIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
                required: true,
            },
        ],
        roomDetails: [
            {
                roomId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Room",
                    required: true,
                },
                number: {
                    type: Number,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
        dates: {
            type: [Date],
            required: true,
            validate: {
                validator: (arr) => arr.length > 0,
                message: "At least one reservation date is required",
            },
        },
        totalPrice: {
            type: Number,
            required: true,
            min: [0, "Total price cannot be negative"],
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },
        paymentMethod: {
            type: String,
            enum: ["esewa", "khalti", "cash"],
            default: "cash",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "cancel_requested"],
            default: "pending",
        },
        cancellationRequestedAt: {
            type: Date,
        },
        pidx: {
            type: String,
            sparse: true
        }, // For Khalti transaction reference
        product_code: {
            type: String,
            sparse: true
        }, // For eSewa product code reference
    },
    { timestamps: true }
);

export default mongoose.model("Reservation", ReservationSchema);