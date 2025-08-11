// src/context/UserContext.jsx
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
