"use client";
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Test = () => {
  const { userData } = useContext(UserContext);

  const click = () => {
    console.log(userData);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-white">
      <p onClick={() => click()}>Test</p>
      <p>{userData.locale}</p>
      <p>{userData.username}</p>
    </div>
  );
};

export default Test;
