import { create } from "zustand";
import { Chat } from "../models/chat.model";

export interface ChatStore {
  chatList: Chat[];
  setChatList: (value: Chat[] | ((list: Chat[]) => Chat[])) => void;
  currentChat: Chat | null;
  setCurrentChat: (value: Chat | ((chat: Chat | null) => Chat)) => void;
}

const useChatStore = create<ChatStore>((set, get) => {
  return {
    currentChat: null,
    chatList: [],
    setChatList(value) {
      const chatList =
        typeof value === "function" ? value(get().chatList) : value;
      set({ chatList });
    },
    setCurrentChat(value) {
      const currentChat =
        typeof value === "function" ? value(get().currentChat) : value;
      set({ currentChat });
    },
  };
});

export default useChatStore;
