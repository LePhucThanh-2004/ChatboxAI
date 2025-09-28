import React from 'react';

const Sidebar: React.FC = () => {
    const [conversations, setConversations] = React.useState<string[]>([]);
    const [darkMode, setDarkMode] = React.useState<boolean>(false);

    const createNewConversation = () => {
        const newConversation = prompt("Enter conversation name:");
        if (newConversation) {
            setConversations([...conversations, newConversation]);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
            <h2>Conversations</h2>
            <ul>
                {conversations.map((conversation, index) => (
                    <li key={index}>{conversation}</li>
                ))}
            </ul>
            <button onClick={createNewConversation}>New Conversation</button>
            <button onClick={toggleDarkMode}>
                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
        </div>
    );
};

export default Sidebar;