"use client";

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  //roboczo zmien useState na true zeby widziec strone po zalogowaniu
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("loginToken");
      if (token) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          token: token,
        }));
        setIsLogged(true);
      }
    };

    checkToken();
  }, []);

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
