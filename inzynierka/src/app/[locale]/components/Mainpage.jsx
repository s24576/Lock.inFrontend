"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import useAxios from "../hooks/useAxios";
import { useTranslation } from "react-i18next";

const Mainpage = () => {
  const { userData, isLogged, setUserData, setIsLogged } =
    useContext(UserContext);

  const api = useAxios();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await api.get("/user/getUserData");
        if (response.status === 200) {
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...response.data, // Poprawne rozpakowanie danych użytkownika do stanu
          }));
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Możesz dodać tutaj dodatkową obsługę błędów, jeśli jest potrzebna
      }
    };

    checkToken();
  }, []);

  const { t } = useTranslation();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-white">
      {isLogged && (
        <div>
          {isLogged && <p>User id: {userData.id}</p>}
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
