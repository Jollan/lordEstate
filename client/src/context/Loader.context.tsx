import { createContext, ReactNode, useState } from "react";

export const LoaderContext = createContext<{
  loading: boolean;
  setLoading: (value: boolean) => void;
}>({} as any);

interface LoaderContextProviderProps {
  children: ReactNode;
}

export const LoaderContextProvider = ({
  children,
}: LoaderContextProviderProps) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
