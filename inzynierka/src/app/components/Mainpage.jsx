"use client";
import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const Mainpage = () => {
  const { userData } = useContext(UserContext);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-white">
      <h1 className="text-[36px]">Followed summoners</h1>
      {Array.isArray(userData.watchList) && userData.watchList.length > 0 ? (
        userData.watchList.map((summonerId) => {
          return <p>{summonerId}</p>;
        })
      ) : (
        <p>You are not following any summoners</p>
      )}
    </div>
  );
};

export default Mainpage;
