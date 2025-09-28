import { IMessage } from '@/types';
import React, { useState } from 'react';

const MessageInput: React.FC<{ onSend: (message: IMessage) => void }> = ({ onSend }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {
            onSend({id: Date.now().toString(), content: inputValue, sender: {
                type: 'user',
                id: '',
                name: ''
            }, timestamp: new Date()});
            setInputValue('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // Allow multi-line input
                return;
            }
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="message-input">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default MessageInput;