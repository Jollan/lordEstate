import { createContext, ReactNode, useState } from "react";

export const ProfileContext = createContext<{
  ownerId?: string;
  setOwnerId?: (id: string) => void;
}>({} as any);

interface ProfileContextProviderProps {
  children: ReactNode;
}

export const ProfileContextProvider = ({
  children,
}: ProfileContextProviderProps) => {
  const [ownerId, setOwnerId] = useState<string>(null!);

  return (
    <ProfileContext.Provider value={{ ownerId, setOwnerId }}>
      {children}
    </ProfileContext.Provider>
  );
};
