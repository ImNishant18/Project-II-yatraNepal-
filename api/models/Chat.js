import mongoose from "mongoose";

// Chat model schema
const ChatSchema = new mongoose.Schema({

    members: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model("Chat", ChatSchema);