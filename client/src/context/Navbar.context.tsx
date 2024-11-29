import { createContext } from "react";

export const NavbarContext = createContext<{
  collapse: boolean;
  setCollapse: (value: boolean) => void;
  responsivity: boolean;
  setResponsivity: (value: boolean) => void;
}>({} as any);
