"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useAxios from "../hooks/useAxios";
import { UserContext } from "../context/UserContext";
import LanguageChanger from "./LanguageChanger";
import { useTranslation } from "react-i18next";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/componentsShad/ui/sheet";
import FriendList from "./FriendList";
import { useRouter } from "next/navigation";
import { FaMessage, FaBookOpen } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import { BiSolidLock } from "react-icons/bi";
import { RISwordFill, RILock2Fill, RITeamFill } from "@icongo/ri";
import { GoDeviceDesktop } from "react-icons/go";
import { IoDesktopOutline } from "react-icons/io5";

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
    localStorage.removeItem("loginToken");
    setUserData({});
    setDuoSettings({});
    setIsLogged(false);
    router.push("/");
  };

  //loading state do zrobienia przy okazji navbara dla zalogowanych
  if (loading) {
    return (
      <div className="h-[72px] fixed bg-transparent w-full text-amber flex justify-center items-center z-20">
        <Link
          href="/"
          className="text-[42px] absolute left-1/2 transform -translate-x-1/2"
        >
          logo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col font-bangers">
      <div className="h-[72px] fixed bg-transparent  w-full text-amber flex items-center px-4 z-20 ">
        {isLogged && (
          <Sheet>
            <SheetTrigger>
              <RxHamburgerMenu className="text-[28px] text-[#F5B800]"></RxHamburgerMenu>
            </SheetTrigger>
            <SheetContent
              side={"left"}
              className="bg-[#131313] text-[#f5f5f5] border-r-[1px] border-r-[#f5f5f5]"
            >
              <SheetHeader>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/builds">Builds</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/builds/create">Create build</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/builds/me">My Builds</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/builds/saved">Saved Builds</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/duo">Duo</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/duo/invites">Duo invites</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/courses">Courses</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/user/my-reports">My Reports</Link>
                </SheetClose>
                <SheetClose asChild className="hover:text-[#f5b800] ">
                  <Link href="/adminPanel">Admin</Link>
                </SheetClose>

                <SheetDescription className="hidden">
                  description
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        )}

        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex">
            {/* <RILock2Fill fill="#f5b800" className="text-[40px]"></RILock2Fill> */}
            <BiSolidLock className="text-[40px]"></BiSolidLock>
            <p className="text-[32px] pt-[1px]">Lock.in</p>
          </Link>

          <div className="flex gap-x-7 items-center">
            <Link href="/builds" className="flex items-center gap-x-1">
              <RISwordFill fill="#f5b800" className="text-[28px]"></RISwordFill>
              <p className="text-[24px]">{t("navbar:builds")}</p>
            </Link>

            <Link href="/courses" className="flex items-center gap-x-1">
              <FaBookOpen className="text-[28px]"></FaBookOpen>
              <p className="text-[24px]">{t("navbar:courses")}</p>
            </Link>

            <Link href="/duo" className="flex items-center gap-x-1">
              <RITeamFill fill="#f5b800" className="text-[28px]"></RITeamFill>
              <p className="text-[24px] pt-[2px]">{t("navbar:team-up")}</p>
            </Link>

            <Link href="/courses" className="flex items-center gap-x-1">
              <IoDesktopOutline className="text-[28px]"></IoDesktopOutline>
              <p className="text-[24px] pt-[1px]">{t("navbar:desktop")}</p>
            </Link>
          </div>
        </div>

        <div className="flex gap-x-1 ml-auto items-center">
          {isLogged && (
            <Link href="/findProfile">{t("navbar:findProfile")}</Link>
          )}

          {isLogged && (
            <Link href="/messenger">
              <FaMessage className="cursor-pointer text-[20px] text-[#F5B800]" />
            </Link>
          )}
          {isLogged && <FriendList className="cursor-pointer text-[20px] " />}
          {isLogged && (
            <Link href="/account/settings">
              <FaUser className="cursor-pointer text-[20px] text-[#F5B800]"></FaUser>
            </Link>
          )}
          {isLogged && (
            <MdLogout
              onClick={logout}
              className="cursor-pointer text-[24px] text-[#f5b800]"
            >
              {t("navbar:logOut")}
            </MdLogout>
          )}

          <LanguageChanger></LanguageChanger>
          <Link
            href="/login"
            className="px-8 bg-amber py-1 rounded-3xl text-[24px] text-night"
          >
            Sign In
          </Link>
        </div>
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
