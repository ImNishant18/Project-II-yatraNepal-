import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Routes
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import hotelRoute from "./routes/hotels.js";
import roomRoute from "./routes/rooms.js";
import exchangeRoute from "./routes/exchange.js";
import touristGuideRoute from "./routes/touristguide.js";
import chatRoute from "./routes/chat.js";
import messageRoutes from "./routes/message.js";
import placeRoutes from "./routes/place.js";
import reviewRoute from "./routes/review.js";
import searchRoute from "./routes/search.js";
import blogRoute from "./routes/blog.js";
import calendarRoute from "./routes/calendar.js";
import chadParbaRoute from "./routes/chadParba.js";
import bookingRoute from "./routes/booking.js";
import imageSliderRoute from "./routes/imageSlider.js";
import reservationRoute from "./routes/reservations.js";
import paymentRoute from "./routes/payment.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

// Mount API routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/hotels", hotelRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/money-exchange", exchangeRoute);
app.use("/api/touristguide", touristGuideRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/review", reviewRoute);
app.use("/api/search", searchRoute);
app.use("/api/blogs", blogRoute);
app.use("/api", calendarRoute);
app.use("/api/chadparba", chadParbaRoute);
app.use("/api", bookingRoute);
app.use("/api/imageSlider", imageSliderRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/payment', paymentRoute);
// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
});

const PORT = process.env.PORT || 8800;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB.");
        server.listen(PORT, () => {
            console.log(`Backend running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

startServer();

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected!");
});
