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