import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../models/user.model";

export const AuthContext = createContext<{
  currentUser?: User | null;
  updateCurrentUser: (user: User | null) => void;
}>({} as any);

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")!);
    if (user) setCurrentUser(user);
  }, []);

  const updateCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    localStorage[user ? "setItem" : "removeItem"]("user", JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
