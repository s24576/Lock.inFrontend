"use client";
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <button className="text-white">Register</button>
      </form>
    </div>
  );
};

export default Register;
