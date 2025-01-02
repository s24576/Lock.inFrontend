"use client";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import getLocale from "../api/user/getLocale";
import useAxios from "../hooks/useAxios";

const Login = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLogged, setIsLogged, setUserData, userData } =
    useContext(UserContext);

  const router = useRouter();
  const pathname = usePathname();

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const axiosInstance = useAxios();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/user/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );
      console.log("zalogowano", response.data);

      const token = response.data;

      if (token) {
        sessionStorage.setItem("loginToken", token);
        setUserData({ token: token });
        setIsLogged(true);
      }

      console.log("zalogowano");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        setErrorMessage(error.response.data);
      } else {
        console.error("Error message:", error.message);
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const { refetch: languageRefetch, isLoading: languageIsLoading } = useQuery(
    "languageChange",
    () => getLocale(axiosInstance),
    {
      enabled: false,
      refetchOnWindowFocus: false, // Opcjonalnie wyłącz odświeżanie przy zmianie okna
      onSuccess: (data) => {
        setUserData((prevData) => {
          return {
            ...prevData,
            locale: data,
          };
        });
      },
    }
  );

  //get user info i getLocale
  const getUserInfo = async () => {
    console.log("getting user info:", userData.token);

    const langRegex = /^\/([a-z]{2})\//;
    const langMatch = pathname.match(langRegex);
    const language = langMatch ? langMatch[1] : "en";
    console.log("language, ", language);

    try {
      const response = await axios.get(
        "http://localhost:8080/user/getUserData",
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Accept-Language": language,
          },
        }
      );
      console.log("got user info:", response.data);
      setUserData(response.data);
      languageRefetch();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData.token) {
      console.log("ss");
      getUserInfo();
    }
  }, [isLogged, router]);

  return (
    <div className="text-white-smoke h-screen w-full flex flex-col items-center justify-center bg-night">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[28%] p-10 text-white-smoke  items-center rounded-3xl"
      >
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        <p className="text-white-smoke  font-semibold text-[48px]">
          {t("login:header")}
        </p>
        <input
          type="text"
          placeholder={t("login:username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-12 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg text-night"
        />
        <input
          type="password"
          placeholder={t("login:password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-5 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg text-night"
        />
        <div className="mt-4 flex justify-between w-[80%] text-[20px] text-gray-100 font-semibold">
          <Link href="/register">{t("login:registerRedirect")}</Link>
          <Link href="/login/forgot-password">{t("login:forgotPassword")}</Link>
        </div>

        <button className="mt-4 w-[50%] text-gray-100 py-1 text-[22px] font-semibold rounded-full border-2 border-silver shadow-lg hover:scale-105 transition-all duration-150">
          {t("login:logIn")}
        </button>
        <div className="mt-6 flex gap-x-4 text-gray-100 text-[48px]">
          <FaGoogle className="cursor-pointer"></FaGoogle>
          <FaFacebook className="cursor-pointer"></FaFacebook>
        </div>
      </form>
    </div>
  );
};

export default Login;
