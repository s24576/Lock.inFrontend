"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { UserContext } from "../context/UserContext";
import Image from "next/image";
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

const Navbar = () => {
  const { userData, setUserData, isLogged, setIsLogged } =
    useContext(UserContext);

  const { t } = useTranslation();

  const logout = () => {
    localStorage.removeItem("loginToken");
    setUserData({});
    setIsLogged(false);
  };

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
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
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
        <LanguageChanger></LanguageChanger>
      </div>
    </div>
  );
};

export default Navbar;
