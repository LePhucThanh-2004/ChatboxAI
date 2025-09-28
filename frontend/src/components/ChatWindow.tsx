import React from 'react';
// import './ChatWindow.css'; // Assuming you have a CSS file for styling
import Message from './Message';
import useAutoScroll from '../hooks/useAutoScroll';
import { IMessage } from '@/types';

const ChatWindow: React.FC<{messages: IMessage[]}> = ({messages}) => {
    const chatRef = useAutoScroll();

    return (
        <div className="chat-window">
            <div className="chat-history" ref={chatRef}>
                {messages.map((msg, index) => (
                    <Message key={index} id={msg.id} content={msg.content} sender={msg.sender} timestamp={msg.timestamp}  />
                ))}
            </div>
        </div>
    );
};

export default ChatWindow;