import React from 'react';
import './ChatWindow.css'; // Assuming you have a CSS file for styling
import Message from './Message';
import { useAutoScroll } from '../hooks/useAutoScroll';

const ChatWindow = ({ messages }) => {
    const chatRef = useAutoScroll();

    return (
        <div className="chat-window">
            <div className="chat-history" ref={chatRef}>
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
            </div>
        </div>
    );
};

export default ChatWindow;