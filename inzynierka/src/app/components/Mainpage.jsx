"use client";
import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const Mainpage = () => {
  const { userData, isLogged } = useContext(UserContext);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-white">
      {isLogged && (
        <div>
          {isLogged && <p>User token: {userData.token}</p>}
          <h1 className="text-[36px]">Followed summoners</h1>
          {Array.isArray(userData.watchList) &&
          userData.watchList.length > 0 ? (
            userData.watchList.map((summonerId, key) => {
              return <p key={key}>{summonerId}</p>;
            })
          ) : (
            <p>You are not following any summoners</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Mainpage;
