import React, { createContext, useContext, useEffect, useState } from "react";

interface GlobalContextValue {

}

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, setState] = useState<GlobalContextValue>({});

  useEffect(() => {
    // Your code here
  }, []);

  return (
    <GlobalContext.Provider value={state}>
      {children}
    </GlobalContext.Provider>
  );
}