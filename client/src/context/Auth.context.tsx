import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../models/user.model";

export const AuthContext = createContext<{
  currentUser?: Partial<User> | null;
  updateCurrentUser: (user: User | null) => void;
}>({} as any);

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")!);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const updateCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      const { chatIds, ...rest } = user;
      localStorage.setItem("user", JSON.stringify(rest));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
