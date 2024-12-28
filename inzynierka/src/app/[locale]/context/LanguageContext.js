"use client";

import { createContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const LanguageContext = createContext();

export function LanguageContextProvider({ children }) {
  //roboczo zmien useState na true zeby widziec strone po zalogowaniu
  const [language, setLanguage] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    const langRegex = /^\/([a-z]{2})\//;
    const langMatch = pathname.match(langRegex);
    const lang = langMatch ? langMatch[1] : "en";

    setLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
