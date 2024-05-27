"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password !== repeatPassword) {
        setErrorMessage("Passwords are different");
        throw Error("Passwords are different");
      }

      const response = await axios.post("http://localhost:8080/user/register", {
        username: username,
        email: email,
        password: password,
      });

      setIsRegistered(true);

      console.log("dodano do db");
      // Tutaj możesz dodać kod obsługujący poprawną odpowiedź z serwera, na przykład przekierowanie użytkownika do innej strony
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

  useEffect(() => {
    if (isRegistered) {
      router.push("/login");
    }
  }, [isRegistered, router]);

  return (
    <div className="text-white h-screen w-full flex flex-col items-center justify-center bg-linen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[28%] p-10 text-oxford-blue bg-cordovan items-center rounded-3xl"
      >
        <p className="text-oxford-blue font-semibold text-[48px]">
          {t("register:header")}
        </p>
        <input
          type="text"
          placeholder={t("register:username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-12 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-4 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <input
          type="password"
          placeholder={t("register:password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <input
          type="password"
          placeholder={t("register:repeatPassword")}
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="mt-4 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <div className="mt-4 flex justify-between w-[80%] text-[18px] text-gray-100 font-semibold">
          <Link href="/login" className="block">
            <span>{t("register:loginRedirect")}</span>
            <span className="block text-center">
              {t("register:loginRedirect2")}
            </span>
          </Link>
          <Link href="/register">{t("register:forgotPassword")}</Link>
        </div>
        <button className="mt-4 w-[50%] text-gray-100 bg-oxford-blue py-1 text-[22px] font-semibold rounded-full shadow-gray-900 shadow-lg hover:scale-105 transition-all duration-150">
          {t("register:register")}
        </button>
        <div className="mt-6 flex gap-x-4 text-gray-100 text-[48px]">
          <FaGoogle className="cursor-pointer"></FaGoogle>
          <FaFacebook className="cursor-pointer"></FaFacebook>
        </div>
      </form>
    </div>
  );
};

export default Register;
