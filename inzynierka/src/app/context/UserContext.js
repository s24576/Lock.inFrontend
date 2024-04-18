"use client";

import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  //roboczo zmien useState na true zeby widziec strone po zalogowaniu
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState({});

  return (
    <UserContext.Provider
      value={{
        isLogged,
        setIsLogged,
        userData,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
