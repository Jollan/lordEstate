import { createContext, ReactNode, useState } from "react";

export const SessionExpiredModalContext = createContext<{
  isSessionExpired: boolean;
  setIsSessionExpired: (value: boolean) => void;
}>({} as any);

interface SessionExpiredModalContextProviderProps {
  children: ReactNode;
}

export const SessionExpiredModalContextProvider = ({
  children,
}: SessionExpiredModalContextProviderProps) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  return (
    <SessionExpiredModalContext.Provider
      value={{ isSessionExpired, setIsSessionExpired }}
    >
      {children}
    </SessionExpiredModalContext.Provider>
  );
};
