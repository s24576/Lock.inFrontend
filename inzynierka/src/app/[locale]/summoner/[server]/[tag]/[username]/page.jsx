import React from "react";
import SummonerProfile from "@/app/[locale]/components/SummonerProfile";
import { Toaster } from "sonner";
import Footer from "@/app/[locale]/components/Footer";

const page = () => {
  return (
    <div>
      <SummonerProfile></SummonerProfile>
      <Footer></Footer>
    </div>
  );
};

export default page;
