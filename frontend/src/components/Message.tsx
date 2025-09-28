import React from 'react';

interface MessageProps {
    content: string;
    sender: 'user' | 'system';
    message: string;
}

const Message: React.FC<MessageProps> = ({ content, sender, message }) => {
    const messageClass = sender === 'user' ? 'message-user' : 'message-system';

    return (
        <div className={`message ${messageClass}`}>
            <div className="message-content">
                {content}
            </div>
            <div className="message-timestamp">
                {/* {timestamp} */}
            </div>
        </div>
    );
};

export default Message;