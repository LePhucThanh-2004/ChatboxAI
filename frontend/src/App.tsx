import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { Message } from './types';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSendMessage = (newMessage: Message) => {
        setLoading(true);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLoading(false);
    };

    return (
        <div className="app-container">
            <Sidebar />
            <ChatWindow messages={messages} />
            {loading && <LoadingSpinner />}
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default App;