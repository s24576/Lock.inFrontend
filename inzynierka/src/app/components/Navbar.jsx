"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../context/UserContext";
import Image from "next/image";

const Navbar = () => {
  const { userData, setUserData, isLogged, setIsLogged } =
    useContext(UserContext);

  const logout = () => {
    setUserData({});
    setIsLogged(false);
  };

  return (
    <div className="h-[72px] fixed bg-oxford-blue w-full text-gray-100 flex justify-between items-center px-4">
      <Link
        href="/"
        className="text-[42px] absolute left-1/2 transform -translate-x-1/2"
      >
        logo
      </Link>
      <div className="flex space-x-4 ml-auto items-center">
        <Link href="/login">Log in</Link>
        <Link href="/register">Register</Link>
        <Link href="/findPlayer">Find Player</Link>
        <Link href="/findProfile">Find Profile</Link>
        {isLogged && (
          <p onClick={logout} className="cursor-pointer">
            Log Out
          </p>
        )}
        <Image
          src="/flags/english.svg"
          alt="english"
          className="cursor-pointer border-[1px] border-gray-100 rounded-full"
          width={45}
          height={45}
        />
      </div>
    </div>
  );
};

export default Navbar;
