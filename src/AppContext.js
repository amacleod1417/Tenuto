import React, { createContext, useState } from 'react';

// Create a context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [inputText, setSharedData] = useState('');

  return (
    <AppContext.Provider value={{ inputText, setSharedData }}>
      {children}
    </AppContext.Provider>
  );
};
