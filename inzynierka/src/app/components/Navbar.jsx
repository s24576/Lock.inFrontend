"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { userData, setUserData, isLogged, setIsLogged } =
    useContext(UserContext);

  const logout = () => {
    setUserData({});
    setIsLogged(false);
  };

  return (
    <div className="h-[70px] fixed bg-slate-300 w-full text-black">
      <Link href="/login">Log in</Link>
      <Link href="/register">Register</Link>
      <Link href="/findPlayer">Find Player</Link>
      {isLogged && (
        <p onClick={logout} className="cursor-pointer">
          Log Out
        </p>
      )}
      {isLogged && <p> Hello, {userData.userId}</p>}
    </div>
  );
};

export default Navbar;
