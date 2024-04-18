"use client";

import { createContext, useState } from "react";

export const ProfileContext = createContext();

export function ProfileContextProvider({ children }) {
  //roboczo zmien useState na true zeby widziec strone po zalogowaniu
  const [profileData, setProfileData] = useState({});
  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setProfileData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
