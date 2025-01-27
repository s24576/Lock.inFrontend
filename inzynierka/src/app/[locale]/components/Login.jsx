"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation } from "react-query";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import getLocale from "../api/user/getLocale";
import login from "../api/user/login";
import useAxios from "../hooks/useAxios";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLogged, setIsLogged, setUserData, userData } =
    useContext(UserContext);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const axios = useAxios();
  const axiosPublic = useAxiosPublic();

  const axiosInstance = isLogged ? axios : axiosPublic;

  const { mutate: loginMutation, isLoading: loginIsLoading } = useMutation(
    () => login(axiosInstance, password, username),
    {
      onSuccess: (data) => {
        if (data) {
          sessionStorage.setItem("loginToken", data);
          setUserData({ token: data });
          setIsLogged(true);
          setErrorMessage("");
          setIsRedirecting(true);
        }
      },
      onError: (error) => {
        if (error.response) {
          console.error("Error response:", error.response);
          setErrorMessage(error.response.data);
        } else {
          console.error("Error message:", error.message);
          setErrorMessage("An error occurred. Please try again later.");
        }
      },
    }
  );

  const { refetch: languageRefetch, isLoading: languageIsLoading } = useQuery(
    "languageChange",
    () => getLocale(axiosInstance),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setUserData((prevData) => ({
          ...prevData,
          locale: data,
        }));
      },
    }
  );

  const { refetch: userDataRefetch } = useQuery(
    "userData",
    async () => {
      const response = await axiosInstance.get("/user/getUserData");
      return response.data;
    },
    {
      enabled: false,
      onSuccess: (data) => {
        setUserData(data);
        languageRefetch();
        router.push("/home");
      },
      onError: (error) => {
        console.error("Error fetching user data:", error);
      },
    }
  );

  useEffect(() => {
    if (userData.token) {
      userDataRefetch();
    }
  }, [isLogged, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    loginMutation();
  };

  return (
    <div className="h-screen w-full flex">
      <div className="w-[50%] bg-night flex flex-col items-center justify-center">
        <p className="text-[96px] font-bangers text-amber">
          {t("login:header")}
        </p>
        <form
          onSubmit={handleSubmit}
          className="font-dekko w-full flex flex-col items-center gap-y-4"
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
          {errorMessage && <p className="text-amber">{errorMessage}</p>}
          <div className="w-[50%] flex justify-end">
            <Link
              className="text-[18px] text-white-smoke hover:text-silver transform-colors duration-100"
              href={"/login/forgot-password"}
            >
              <p>{t("login:forgotPassword")}</p>
            </Link>
          </div>
          <button
            className={`h-[56px] flex justify-center items-center bg-amber w-[50%] py-1 rounded-3xl text-night text-[36px] ${
              (loginIsLoading && !errorMessage) || isRedirecting
                ? "bg-silver cursor-not-allowed"
                : "hover:bg-silver transform-colors duration-150"
            }`}
            disabled={(loginIsLoading && !errorMessage) || isRedirecting}
          >
            {loginIsLoading && !errorMessage ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : isRedirecting ? (
              <p className="text-[30px]">{t("common:redirecting")}</p>
            ) : (
              <p>{t("login:signIn")}</p>
            )}
          </button>
        </form>
        <div className="flex items-center font-dekko mt-6 gap-x-1 text-[18px]">
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
