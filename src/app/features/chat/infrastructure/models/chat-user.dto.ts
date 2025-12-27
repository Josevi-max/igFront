import { MessageStatus } from "../../domain/models/chat.model";

export interface ApiResponseDto<T> {
  success: boolean;
  data?: T;
}

export interface UserApiDto {
  id: number;
  name: string;
  username: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface StatusResponseDto {
  status: string;
}

export interface RoomResponseDto {
  roomId: number;
}

export interface NewMessageApiDto {
  chat: Message;
}

export interface Message {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  status: MessageStatus;
  tempId?: string;
  room_id?: number
}

export interface TypingResponse {
  idUserTyping: number;
  isTyping: boolean;
}

export enum ChannelsListened {
  USER_TYPING = 'user-typing',
  NEW_MESSAGE = 'new-chat-message',
  MESSAGE_STATUS_CHANGED = 'message-status-changed',
  CHAT = 'chat'
}