"use client";
import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLogged, setIsLogged, setUserData, userData } =
    useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        username: username,
        password: password,
      });

      setUserData(response.data);
      setIsLogged(true);

      console.log("zalogowano");
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
    <div className="text-white h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[280px] gap-2 text-black"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="text-white">Log In</button>
      </form>
    </div>
  );
};

export default Login;
