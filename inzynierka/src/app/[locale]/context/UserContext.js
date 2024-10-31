"use client";

import { createContext, useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState({});

  //db czy local storage?
  const [duoSettings, setDuoSettings] = useState({});

  return (
    <UserContext.Provider
      value={{
        isLogged,
        setIsLogged,
        userData,
        setUserData,
        duoSettings,
        setDuoSettings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
