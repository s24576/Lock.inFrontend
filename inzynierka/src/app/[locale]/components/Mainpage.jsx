"use client";
import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const Mainpage = () => {
  const { userData, isLogged } = useContext(UserContext);

  const { t } = useTranslation();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-white">
      {isLogged && (
        <div>
          {isLogged && <p>User token: {userData.token}</p>}
          <h1 className="text-[36px]">{t("header")}</h1>
          {Array.isArray(userData.watchList) &&
          userData.watchList.length > 0 ? (
            userData.watchList.map((summonerId, key) => {
              return <p key={key}>{summonerId}</p>;
            })
          ) : (
            <p>{t("noneFollowed")}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Mainpage;
