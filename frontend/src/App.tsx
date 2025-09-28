import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { IMessage } from './types';

const App: React.FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSendMessage = (newMessage: IMessage) => {
        setLoading(true);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLoading(false);
    };

    return (
        <div className="app-container">
            <Sidebar />
            <ChatWindow messages={messages} />
            {loading && <LoadingSpinner />}
            <MessageInput onSend={handleSendMessage} />
        </div>
    );
};

export default App;