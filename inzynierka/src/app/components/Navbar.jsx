"use client";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="h-[70px] fixed bg-slate-300 w-full text-black">
      <Link href="/login">Log in</Link>
      <Link href="/register">Register</Link>
    </div>
  );
};

export default Navbar;
