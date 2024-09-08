"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import useAxios from "../hooks/useAxios";
import { UserContext } from "../context/UserContext";
import { IoPeople, IoPersonAddSharp } from "react-icons/io5";
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
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import FriendList from "./FriendList";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { userData, setUserData, isLogged, setIsLogged } =
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
    setIsLogged(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="h-[72px] fixed bg-oxford-blue w-full text-gray-100 flex justify-center items-center z-20">
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
    <div className="h-[72px] fixed bg-oxford-blue w-full text-gray-100 flex justify-between items-center px-4 z-20">
      <Sheet>
        <SheetTrigger>
          <RxHamburgerMenu className="text-[28px]"></RxHamburgerMenu>
        </SheetTrigger>
        <SheetContent side={"left"} className="bg-oxford-blue">
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetClose asChild>
              <Link href="/builds/create">Create build</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/builds/me">My Builds</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/builds/saved">Saved Builds</Link>
            </SheetClose>

            <SheetDescription>
              Tssshis action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Link
        href="/"
        className="text-[42px] absolute left-1/2 transform -translate-x-1/2"
      >
        logo
      </Link>
      <div className="flex space-x-4 ml-auto items-center">
        {!isLogged && <Link href="/login">{t("navbar:logIn")}</Link>}
        {!isLogged && <Link href="/register">{t("navbar:register")}</Link>}
        <Link href="/findPlayer">{t("navbar:findPlayer")}</Link>
        <Link href="/findProfile">{t("navbar:findProfile")}</Link>
        <Link href="/builds">{t("navbar:builds")}</Link>
        {isLogged && (
          <p onClick={logout} className="cursor-pointer">
            {t("navbar:logOut")}
          </p>
        )}
        {isLogged && <FriendList />}
        <LanguageChanger></LanguageChanger>
      </div>
    </div>
  );
};

export default Navbar;
