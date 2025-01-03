"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useAxios from "../../hooks/useAxios";
import { UserContext } from "../../context/UserContext";
import LanguageChanger from "../LanguageChanger";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import FriendList from "../FriendList";
import { useRouter } from "next/navigation";
import { FaComment, FaBookOpen } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import { BiSolidLock } from "react-icons/bi";
import { RISwordFill, RILock2Fill, RITeamFill } from "@icongo/ri";
import { GoDeviceDesktop } from "react-icons/go";
import { IoDesktopOutline, IoNotifications } from "react-icons/io5";

const Navbar = () => {
  const { userData, setUserData, isLogged, setIsLogged, setDuoSettings } =
    useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const api = useAxios();
  const router = useRouter();

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

  const logout = () => {
    sessionStorage.removeItem("loginToken");
    setUserData({});
    setDuoSettings({});
    setIsLogged(false);
    router.push("/");
  };

  if (loading) {
    return <div className="w-full bg-transparent"></div>;
  }

  return (
    <div className="flex flex-col font-bangers">
      <div className="h-[72px] fixed bg-transparent  w-full text-amber flex items-center px-4 z-20 ">
        {isLogged && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-5">
              <Sidebar></Sidebar>
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
                  <RITeamFill
                    fill="#f5b800"
                    className="text-[28px]"
                  ></RITeamFill>
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
              <FriendList className="cursor-pointer" />
              <Link href="/messenger">
                <FaComment className="cursor-pointer text-[26px] text-[#F5B800]" />
              </Link>
              <IoNotifications className="text-[28px] cursor-pointer" />
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
      {userData.confirmedAccount === false && (
        <div className="h-[40px] flex items-center fixed w-full z-20 bg-yellow-500 mt-[70px] px-4 gap-x-5">
          <CiWarning className="text-[28px]"></CiWarning>
          <p className="font-semibold">
            Your account is not confirmed yet, click{" "}
            <Link href="/login/confirmRegistration" className="underline">
              here
            </Link>{" "}
            to confirm
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
