import React, { createContext, useContext, useEffect, useState } from 'react';

interface GlobalContextValue {
  callback: (...args: any[]) => void;
  setCallback: (callback: (...args: any[]) => void) => void;
}

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const [callback, setCallback] = useState(() => () => {});
  useEffect(() => {
    // Your code here
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        callback,
        setCallback
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
