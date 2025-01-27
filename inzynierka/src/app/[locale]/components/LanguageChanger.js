"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import useAxios from "../hooks/useAxios";
import i18nConfig from "../../../../i18nConfig";
import changeLocale from "../api/user/changeLocale";

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const languages = i18nConfig.locales;

  const axiosInstance = useAxios();

  const { mutateAsync: handleChangeLocale } = useMutation(
    (newLocale) => changeLocale(axiosInstance, newLocale),
    {
      onSuccess: (data) => {
        console.log("locale changed successfully:", data);
      },
      onError: (error) => {
        console.error("Error locale change:", error);
      },
    }
  );

  const handleChange = (newLocale) => {
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      handleChangeLocale(newLocale);
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }
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
    <ul className="text-[24px] z-20">
      <li
        ref={languagesRef}
        className="px-2 cursor-pointer flex items-center relative"
      >
        <span
          className="cursor-pointer rounded-full px-3 py-1 hover:text-silver transition-colors duration-200 "
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
                      className="cursor-pointer  rounded-full px-3 py-1 hover:text-silver transition-colors duration-200 "
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
