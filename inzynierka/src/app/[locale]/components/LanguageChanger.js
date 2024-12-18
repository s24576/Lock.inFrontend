"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig from "../../../../i18nConfig";

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const languages = i18nConfig.locales; // Assuming this array contains all available locales

  const handleChange = (newLocale) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  const [showLanguages, setShowLanguages] = useState(false);
  const languagesRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (languagesRef.current && !languagesRef.current.contains(e.target)) {
        setShowLanguages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowLanguages(!showLanguages);
  };

  return (
    <ul className="text-[24px]">
      <li
        ref={languagesRef}
        className="px-2 cursor-pointer flex items-center relative"
      >
        <span
          className="cursor-pointer rounded-full px-3 py-1"
          onClick={toggleDropdown}
        >
          {currentLocale === "en" ? "ENG" : "PL"}
        </span>
        {showLanguages && (
          <div className="absolute top-full left-0 mt-1  rounded-md">
            <ul className="py-1">
              {languages
                .filter((locale) => locale !== currentLocale)
                .map((locale) => (
                  <li key={locale} className="p-2">
                    <span
                      className="cursor-pointer  rounded-full px-3 py-1"
                      onClick={() => handleChange(locale)}
                    >
                      {locale === "en" ? "ENG" : "PL"}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </li>
    </ul>
  );
}
