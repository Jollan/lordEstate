import { Metadata } from "./models";
import { User } from "./user.model";

export interface Chat extends Metadata {
  users?: [Partial<User>, Partial<User>];
  userIds: string[];
  seenBy: string[];
  messages?: Message[];
  lastMessage?: string;
  updatedAt?: number;
}

export type ChatPlus = Chat & { correspondent: Partial<User> };

export interface Message extends Metadata {
  text: string;
  senderId: string;
  send: boolean;
  read: boolean;
  chat?: Chat;
  chatId: string;
  failed?: boolean;
}
