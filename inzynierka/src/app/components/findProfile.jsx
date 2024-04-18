"use client";
import React, { useState, useContext } from "react";
import axios from "axios";
import { ProfileContext } from "../context/ProfileContext";
import { redirect } from "next/navigation";

const FindProfile = () => {
  const [username, setUsername] = useState("");
  const [resultsFound, setResultsFound] = useState(false);
  const { setProfileData } = useContext(ProfileContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:8080/profile/findProfile?username=${username}`
      );

      setProfileData(response.data);
      console.log(response.data);
      setResultsFound(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (resultsFound) {
    redirect(`/profile/${username}`);
  }

  return (
    <div className="h-screen w-full flex justify-center items-center text-white">
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Type username"
          className="py-2 px-4 text-black"
        />
        <button type="submit" className="border-2 border-white py-2 mt-2">
          Search profile
        </button>
      </form>
    </div>
  );
};

export default FindProfile;
