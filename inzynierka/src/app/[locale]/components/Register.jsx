"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/componentsShad/ui/checkbox";
import { useMutation } from "react-query";
import register from "../api/user/register";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Register = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const axiosPublic = useAxiosPublic();

  const { mutate: registerMutation, isLoading: registerIsLoading } =
    useMutation(
      () =>
        register(axiosPublic, {
          username,
          email,
          password,
        }),
      {
        onSuccess: () => {
          setErrorMessage("");
          setIsRedirecting(true);
          router.push("/login");
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorMessage(t("register:invalidEmail"));
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage(t("register:passwordsDifferent"));
      return;
    }

    if (!termsAccepted) {
      setErrorMessage(t("register:acceptTermsError"));
      return;
    }

    setErrorMessage("");
    registerMutation();
  };

  return (
    <div className="h-screen w-full flex">
      <div className="w-[50%] bg-night flex flex-col items-center justify-center">
        <p className="text-[96px] font-bangers text-amber">
          {t("register:header")}
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
          <div className="w-[50%] flex items-center gap-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              className="border-2 border-amber data-[state=checked]:bg-amber data-[state=checked]:text-night"
            />
            <label
              htmlFor="terms"
              className="text-[18px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("register:acceptTerms")}
            </label>
          </div>
          {errorMessage && <p className="text-amber">{errorMessage}</p>}
          <button
            className={`h-[56px] flex justify-center items-center bg-amber w-[50%] py-1 rounded-3xl text-night text-[36px] ${
              (registerIsLoading && !errorMessage) || isRedirecting
                ? "bg-silver cursor-not-allowed"
                : "hover:bg-silver transform-colors duration-150"
            }`}
            disabled={(registerIsLoading && !errorMessage) || isRedirecting}
            type="submit"
          >
            {registerIsLoading && !errorMessage ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : isRedirecting ? (
              <p className="text-[30px]">{t("common:redirecting")}</p>
            ) : (
              t("register:register")
            )}
          </button>
        </form>
        <div className="flex items-center font-dekko mt-6 gap-x-1 text-[18px]">
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
          alt="register background"
        />
      </div>
    </div>
  );
};

export default Register;
