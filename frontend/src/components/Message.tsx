import { IMessage } from '@/types';
import React from 'react';


const Message: React.FC<IMessage> = ({id, content, sender, timestamp}) => {
    const messageClass = sender.type === 'user' ? 'message-user' : 'message-system';

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