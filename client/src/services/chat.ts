import Axios from "../lib/http.client";
import { Chat, Message } from "../models/chat.model";

export const getChats = () => {
  return Axios.get<Chat[]>("/chats");
};

export const getChat = (id: string) => {
  return Axios.get<Chat>(`/chats/${id}`);
};

export const createChat = (data: { correspondentId: string }) => {
  return Axios.post<Chat>(`/chats`, data);
};

export const readChat = (id: string) => {
  return Axios.put<Chat>(`/chats/read/${id}`);
};

export const createMessage = (chatId: string, data: { text: string }) => {
  return Axios.post<Message>(`messages/${chatId}`, data);
};

export const readMessage = (chatId: string, id: string) => {
  return Axios.put<Message>(`messages/read/${chatId}/${id}`);
};
