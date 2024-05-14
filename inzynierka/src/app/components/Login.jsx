"use client";
import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    isLogged,
    setIsLogged,
    setUserData,
    userData,
    profileData,
    setProfileData,
  } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        username: username,
        password: password,
      });

      setUserData({ token: response.data });

      setIsLogged(true);

      console.log("zalogowano");
      //redirect

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

  return (
    <div className="text-white h-screen w-full flex flex-col items-center justify-center bg-linen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[28%] p-10 text-oxford-blue bg-cordovan items-center rounded-3xl"
      >
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        <p className="text-oxford-blue font-semibold text-[48px]">Log In</p>
        <input
          type="text"
          placeholder="Username/Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-12 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-5 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <div className="mt-4 flex justify-between w-[80%] text-[20px] text-gray-100 font-semibold">
          <Link href="/register">Sign Up here</Link>
          <Link href="/register">Forgot password?</Link>
        </div>

        <button className="mt-4 w-[50%] text-gray-100 bg-oxford-blue py-1 text-[22px] font-semibold rounded-full shadow-gray-900 shadow-lg hover:scale-105 transition-all duration-150">
          Log In
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
