import Chat from "../models/chat.js";

// Create or get a chat between two users
export const createChat = async (req, res) => {
    const { touristId, guideId } = req.body;

    if (!touristId || !guideId) {
        return res.status(400).json({ error: "Both touristId and guideId are required." });
    }

    try {
        let chat = await Chat.findOne({ members: { $all: [touristId, guideId], $size: 2 } });

        if (!chat) {
            chat = new ({ members: [touristId, guideId] });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all chats for a user (tourist or guide)
export const getUserChats = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        const chats = await Chat.find({ members: userId });
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
