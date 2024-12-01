import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./Auth.context";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<{
  socket: Socket | null;
}>({} as any);

interface SocketContextProviderProps {
  children: ReactNode;
}

const SocketContextProvider = ({ children }: SocketContextProviderProps) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setSocket(io(import.meta.env.VITE_API_URL));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("joinRoom", currentUser.id);
  }, [currentUser?.id, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
