"use client";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import Image from "next/image";
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
      router.push("/home");
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
    <div className="h-screen w-full flex ">
      <div className="w-[50%] bg-night flex flex-col items-center justify-center">
        <p className="text-[96px] font-bangers text-amber">
          {t("login:header")}
        </p>
        <form
          onSubmit={handleSubmit}
          className="font-chewy w-full flex flex-col items-center gap-y-4"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[50%] border-2 border-amber bg-transparent rounded-xl py-3 px-4 text-white-smoke text-[24px] focus:outline-none focus:border-amber placeholder-white"
            placeholder={t("login:username")}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[50%] border-2 border-amber bg-transparent rounded-xl py-3 px-4 text-white-smoke text-[24px] focus:outline-none focus:border-amber placeholder-white"
            placeholder={t("login:password")}
          />
          <div className="w-[50%] flex justify-end">
            <Link
              className="text-[18px] text-white-smoke hover:text-silver transform-colors duration-100"
              href={"/login/forgot-password"}
            >
              <p>{t("login:forgotPassword")}</p>
            </Link>
          </div>
          <button className="bg-amber w-[50%] py-1 rounded-3xl text-night text-[36px] hover:bg-silver transform-colors duration-150">
            <p>{t("login:signIn")}</p>
          </button>
        </form>
        <div className="flex items-center font-chewy mt-6 gap-x-1 text-[18px]">
          <p>{t("login:registerRedirect1")}</p>
          <Link
            href={"/register"}
            className="text-amber hover:text-silver transorm-colors duration-100"
          >
            {t("login:registerRedirect2")}
          </Link>
        </div>
      </div>
      <div className="w-[50%] z-30">
        <img
          src={"/login-photo.webp"}
          width={400}
          height={400}
          className="w-full h-screen object-cover opacity-80"
        />
      </div>
    </div>
  );
};

export default Login;
