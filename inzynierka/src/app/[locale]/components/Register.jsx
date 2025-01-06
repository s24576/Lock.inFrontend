"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/componentsShad/ui/checkbox";

const Register = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password !== repeatPassword) {
        setErrorMessage("Passwords are different");
        throw Error("Passwords are different");
      }

      const registerForm = {
        username: username,
        email: email,
        password: password,
      };

      console.log(registerForm);

      console.log("przed axios", language);
      const response = await axios.post(
        "http://localhost:8080/user/register",
        registerForm,
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );

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
    <div className="h-screen w-full flex ">
      <div className="w-[50%] bg-night flex flex-col items-center justify-center">
        <p className="text-[96px] font-bangers text-amber">
          {t("register:header")}
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
            placeholder={t("register:username")}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[50%] border-2 border-amber bg-transparent rounded-xl py-3 px-4 text-white-smoke text-[24px] focus:outline-none focus:border-amber placeholder-white"
            placeholder={t("register:email")}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[50%] border-2 border-amber bg-transparent rounded-xl py-3 px-4 text-white-smoke text-[24px] focus:outline-none focus:border-amber placeholder-white"
            placeholder={t("register:password")}
          />
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-[50%] border-2 border-amber bg-transparent rounded-xl py-3 px-4 text-white-smoke text-[24px] focus:outline-none focus:border-amber placeholder-white"
            placeholder={t("register:repeatPassword")}
          />
          <div className="w-[50%] flex items-center justify-start ml-2">
            {/* accept terms */}
            <Checkbox
              className="w-5 h-5 border-[2px] border-amber bg-transparent rounded-sm text-amber focus:ring-amber focus:ring-offset-amber checked:bg-amber checked:border-amber hover:bg-silver hover:bg-opacity-10  transform-colors duration-100"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked)}
            />
            <p className="pl-2">{t("register:termsOfService")}</p>
            <Link
              href={"/messenger"}
              className="pl-1 underline hover:text-silver transorm-colors duration-100"
            >
              {t("register:termsOfService2")}
            </Link>
          </div>
          <button className="bg-amber w-[50%] py-1 rounded-3xl text-night text-[36px] hover:bg-silver transform-colors duration-150">
            <p>{t("register:register")}</p>
          </button>
        </form>
        <div className="flex items-center font-chewy mt-6 gap-x-1 text-[18px]">
          <p>{t("register:loginRedirect")}</p>
          <Link
            href={"/login"}
            className="text-amber hover:text-silver transorm-colors duration-100"
          >
            {t("register:loginRedirect2")}
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

export default Register;
