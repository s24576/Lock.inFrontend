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

  const handleChange = (e) => {
    // const newLocale = e.target.value;
    const newLocale = e;

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

  const [languages, setLanguages] = useState(false);
  const languagesRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (languagesRef.current && !languagesRef.current.contains(e.target)) {
        setLanguages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setLanguages(!languages);
    console.log("siema");
  };

  return (
    <ul>
      <li
        ref={languagesRef}
        className="px-4 cursor-pointer flex items-center relative"
      >
        <Image
          src={"/flags/" + currentLocale + ".svg"}
          alt={currentLocale}
          className="cursor-pointer border-[1px] border-gray-100 rounded-full"
          width={45}
          height={45}
          onClick={toggleDropdown}
        />
        {languages && (
          <div className="absolute top-full left-0 mt-1 bg-cordovan rounded-md">
            <ul className="py-1">
              <li className="px-4 py-2">
                <Image
                  src={"/flags/pl.svg"}
                  alt={currentLocale}
                  className="cursor-pointer border-[1px] border-gray-100 rounded-full"
                  width={45}
                  height={45}
                  onClick={() => handleChange("pl")}
                />
              </li>
              <li className="px-4 py-2">
                <Image
                  src={"/flags/en.svg"}
                  alt={currentLocale}
                  className="cursor-pointer border-[1px] border-gray-100 rounded-full"
                  width={45}
                  height={45}
                  onClick={() => handleChange("en")}
                />
              </li>
            </ul>
          </div>
        )}
      </li>
      <li></li>
      <li></li>
    </ul>
  );
}
