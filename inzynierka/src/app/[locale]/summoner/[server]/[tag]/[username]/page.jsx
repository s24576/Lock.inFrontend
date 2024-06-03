import React from "react";
import SummonerProfile from "@/app/[locale]/components/SummonerProfile";
import { Toaster } from "sonner";

const page = () => {
  return (
    <div>
      <SummonerProfile></SummonerProfile>
      <Toaster richColors position="top-center"></Toaster>
    </div>
  );
};

export default page;
