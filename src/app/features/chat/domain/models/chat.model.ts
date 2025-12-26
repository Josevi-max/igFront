export interface Message {
    id: number;
    message: string;
    sender_id: number;
    receiver_id: number;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    status: 'sent' | 'delivered' | 'read';
    tempId?: string;
}

export enum ChannelsListened {
    USER_TYPING = 'user-typing',
    NEW_MESSAGE = 'new-chat-message',
    MESSAGE_STATUS_CHANGED = 'message-status-changed',
    CHAT = 'chat'
}

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read'
}