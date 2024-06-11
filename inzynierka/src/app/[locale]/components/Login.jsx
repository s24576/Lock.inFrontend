"use client";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLogged, setIsLogged, setUserData, userData } =
    useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        username: username,
        password: password,
      });
      console.log("zalogowano", response.data);

      const token = response.data;

      if (token) {
        localStorage.setItem("loginToken", token);
        setUserData({ token: token });
        setIsLogged(true);
      }

      console.log("zalogowano");
    } catch (error) {
      if (error.response) {
        // Serwer zwrócił odpowiedź inną niż 2xx
        setErrorMessage(error.response.data);
      } else {
        // Wystąpił błąd podczas wysyłania żądania
        setErrorMessage(
          "Wystąpił błąd podczas logowania. Spróbuj ponownie później."
        );
      }
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/profile/getWatchList",
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      console.log(response.data);
      setUserData((prevData) => ({
        ...prevData,
        watchList: response.data, // Dodaj lub zaktualizuj pole watchList w userData
      }));
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLogged) {
      console.log("ss");
      getUserInfo();
    }
  }, [isLogged, router]);

  return (
    <div className="text-white h-screen w-full flex flex-col items-center justify-center bg-linen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[28%] p-10 text-oxford-blue bg-cordovan items-center rounded-3xl"
      >
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        <p className="text-oxford-blue font-semibold text-[48px]">
          {t("login:header")}
        </p>
        <input
          type="text"
          placeholder={t("login:username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-12 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <input
          type="password"
          placeholder={t("login:password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-5 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <div className="mt-4 flex justify-between w-[80%] text-[20px] text-gray-100 font-semibold">
          <Link href="/register">{t("login:registerRedirect")}</Link>
          <Link href="/register">{t("login:forgotPassword")}</Link>
        </div>

        <button className="mt-4 w-[50%] text-gray-100 bg-oxford-blue py-1 text-[22px] font-semibold rounded-full shadow-gray-900 shadow-lg hover:scale-105 transition-all duration-150">
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
