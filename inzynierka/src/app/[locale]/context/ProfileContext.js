"use client";

import { createContext, useState } from "react";

export const ProfileContext = createContext();

export function ProfileContextProvider({ children }) {
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
