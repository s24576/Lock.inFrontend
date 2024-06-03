"use client";
import React from "react";
import FindPlayer from "../components/findPlayer";
import { Toaster } from "sonner";

const page = () => {
  return (
    <div>
      <FindPlayer></FindPlayer>
      <Toaster richColors></Toaster>
    </div>
  );
};

export default page;
