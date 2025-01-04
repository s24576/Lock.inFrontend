"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import i18nConfig from "../../../../../i18nConfig";
import useAxios from "../../hooks/useAxios";
import { UserContext } from "../../context/UserContext";
import LanguageChanger from "../LanguageChanger";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import FriendList from "../FriendList";
import { FaComment, FaBookOpen } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { BiSolidLock } from "react-icons/bi";
import { RISwordFill, RITeamFill } from "@icongo/ri";
import { IoDesktopOutline, IoNotifications, IoHome } from "react-icons/io5";

const Navbar = () => {
  const { userData, setUserData, isLogged, setIsLogged } =
    useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const api = useAxios();

  const pathname = usePathname();
  const languages = i18nConfig.locales;
  const navbarBg = languages.includes(pathname.slice(1))
    ? "bg-transparent"
    : "bg-night";

  const [isFixed, setIsFixed] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsFixed(false); // Przestań być fixed po przejściu h-screen
      } else {
        setIsFixed(true); // Pozostaje fixed, jeśli w obrębie h-screen
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await api.get("/user/getUserData");
        if (response.status === 200) {
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...response.data,
          }));
          console.log(response.data);
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const { t } = useTranslation();

  if (loading) {
    return <div className="w-full bg-transparent"></div>;
  }

  return (
    <div className="flex flex-col font-bangers">
      <div
        className={
          `h-[72px] ${navbarBg}  w-full text-amber flex items-center px-4 z-20 ` +
          (isFixed ? "fixed" : "hidden")
        }
      >
        {isLogged && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-5">
              <Sidebar></Sidebar>
              <div className="flex gap-x-7 items-center">
                <Link
                  href="/home"
                  className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
                >
                  <FaHome className="text-[28px]"></FaHome>
                  <p className="text-[24px]">{t("navbar:home")}</p>
                </Link>
                <Link
                  href="/builds"
                  className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
                >
                  <RISwordFill
                    fill="#f5b800"
                    className="text-[28px]"
                  ></RISwordFill>
                  <p className="text-[24px]">{t("navbar:builds")}</p>
                </Link>

                <Link
                  href="/courses"
                  className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
                >
                  <FaBookOpen className="text-[28px]"></FaBookOpen>
                  <p className="text-[24px]">{t("navbar:courses")}</p>
                </Link>

                <Link
                  href="/duo"
                  className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
                >
                  <RITeamFill
                    fill="#f5b800"
                    className="text-[28px]"
                  ></RITeamFill>
                  <p className="text-[24px] pt-[2px]">{t("navbar:team-up")}</p>
                </Link>
              </div>
            </div>

            <Link
              href="/"
              className="flex absolute left-1/2 transform -translate-x-1/2"
            >
              <BiSolidLock className="text-[40px]"></BiSolidLock>
              <p className="text-[32px] pt-[1px]">Lock.in</p>
            </Link>

            <div className="flex gap-x-1 items-center mr-2">
              <LanguageChanger></LanguageChanger>
              <FriendList className="cursor-pointer " />
              <Link href="/messenger">
                <FaComment className="cursor-pointer text-[26px] text-[#F5B800] hover:text-silver transition-colors duration-150" />
              </Link>
              <IoNotifications className="text-[28px] cursor-pointer hover:text-silver transition-colors duration-150" />
            </div>
          </div>
        )}

        {!isLogged && (
          <div className="flex items-center justify-between w-full gap-x-12">
            <Link href="/" className="flex">
              <BiSolidLock className="text-[40px]"></BiSolidLock>
              <p className="text-[32px] pt-[1px]">Lock.in</p>
            </Link>
            <div className="flex gap-x-7 items-center">
              <Link
                href="/builds"
                className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
              >
                <RISwordFill
                  fill="#f5b800"
                  className="text-[28px]"
                ></RISwordFill>
                <p className="text-[24px]">{t("navbar:builds")}</p>
              </Link>

              <Link
                href="/courses"
                className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
              >
                <FaBookOpen className="text-[28px]"></FaBookOpen>
                <p className="text-[24px]">{t("navbar:courses")}</p>
              </Link>

              <Link
                href="/duo"
                className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
              >
                <RITeamFill fill="#f5b800" className="text-[28px]"></RITeamFill>
                <p className="text-[24px] pt-[2px]">{t("navbar:team-up")}</p>
              </Link>

              <Link
                href="/courses"
                className="flex items-center gap-x-1 hover:scale-105 transition-all duration-200"
              >
                <IoDesktopOutline className="text-[28px]"></IoDesktopOutline>
                <p className="text-[24px] pt-[1px]">{t("navbar:desktop")}</p>
              </Link>
            </div>
            <div className="flex gap-x-1 ml-auto items-center">
              <LanguageChanger></LanguageChanger>
              <Link
                href="/login"
                className="px-8 bg-amber py-1 rounded-3xl text-[24px] text-night hover:bg-silver transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
