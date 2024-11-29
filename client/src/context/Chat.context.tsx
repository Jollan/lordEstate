import { createContext, ReactNode, useState } from "react";
import { Chat } from "../models/chat.model";
import { useAsyncValue } from "react-router-dom";

export const ChatContext = createContext<{
  chats: Chat[];
  setChats: (chats: Chat[] | ((chats: Chat[]) => Chat[])) => void;
}>({} as any);

interface ChatContextProviderProps {
  children: ReactNode;
}

export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
  const { data } = useAsyncValue() as Axios.AxiosXHR<Chat[]>;
  const [chats, setChats] = useState(data);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
