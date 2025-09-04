import React from "react";
import { useLocation, useParams } from "react-router-dom";
import "./chat.css";

const ChatPage = () => {
    const { id: guideId } = useParams();
    const { state } = useLocation();

    // Feature toggle — currently under development
    const underDevelopment = true;

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat with {state?.guide?.name || "Guide"}</h2>
            </div>

            {underDevelopment ? (
                <div className="under-development-box">
                    <h3 className="under-development-title">Chat Feature Coming Soon</h3>
                    <p className="under-development-message">
                        This chat feature is currently under development. Please check back later!
                    </p>
                </div>
            ) : (
                <>
                    {/* Future chat UI logic goes here */}
                </>
            )}
        </div>
    );
};

export default ChatPage;