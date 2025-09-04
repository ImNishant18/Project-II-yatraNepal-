import Message from "../models/Message.js";
import { createError } from "../utils/error.js";

// Create Message
export const createMessage = async (req, res, next) => {
    const { chatId, senderId, text, fileUrl } = req.body;

    try {
        const newMessage = new Message({ chatId, senderId, text, fileUrl });
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        next(err); // Use centralized error handling
    }
};

// Get Messages by Chat ID
export const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId });
        res.status(200).json(messages);
    } catch (err) {
        next(err); // Pass error to error middleware
    }
};
