export interface IMessage {
    id: string;
    content: string;
    sender: User;
    timestamp: Date;
}

export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    type: MessageType;
}

export type MessageType = 'user' | 'system';