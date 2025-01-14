"use client";
import React from "react";
import MyCourses from "../../components/courses/MyCourses";
import Footer from "../../components/Footer";

const page = () => {
  return (
    <div className="flex flex-col">
      <MyCourses />
      <Footer />
    </div>
  );
};

export default page;
