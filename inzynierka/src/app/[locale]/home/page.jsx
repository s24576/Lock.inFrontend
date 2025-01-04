"use client";
import React from "react";
import HomePage from "../components/HomePage";
import Footer from "../components/Footer";

const page = () => {
  return (
    <div className="flex flex-col">
      <HomePage></HomePage>
      <Footer></Footer>
    </div>
  );
};

export default page;
