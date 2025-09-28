export interface Message {
    id: string;
    content: string;
    sender: User;
    timestamp: Date;
}

export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
}

export type MessageType = 'user' | 'system';