import React, { useContext, useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import { SearchContext } from "../context/SearchContext";
import { UserContext } from "../context/UserContext";
import { IoMdArrowDropdown } from "react-icons/io";
import useOutsideClick from "../hooks/useOutsideClick";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const serverNames = {
  eun1: "EUNE",
  euw1: "EUW",
  na1: "NA",
};

const FindPlayer = () => {
  const { t } = useTranslation();

  const {
    setParamsData,
    setPlayerData,
    setMasteryData,
    setRankData,
    setLastMatches,
    setMatchHistoryData,
    lastMatches,
  } = useContext(SearchContext);

  const { userData } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [server, setServer] = useState("default");
  const [resultsFound, setResultsFound] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    setLastMatches([]);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(server);
      console.log(tag);
      console.log(username);
      console.log(userData.token);
      const response = await axios.get(
        `http://localhost:8080/riot/findPlayer?server=${server}&tag=${tag}&name=${username}`
      );

      setParamsData({ server, tag, username });
      console.log(response.data);

      setResultsFound(true);
    } catch (error) {
      toast.error("An error occured", {
        description: error,
      });
      console.error("Error occurred:", error);
    }
  };

  if (resultsFound) {
    redirect(`/summoner/${server}/${tag}/${username}`);
  }

  const handleSelect = (value) => {
    setServer(value);
    setIsOpen(false);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center flex-col bg-linen">
      <p className="text-black pb-16 text-[32px]">Grafika</p>
      <form onSubmit={handleSubmit} className="flex flex-col text-gray-100">
        <div className="flex text-[24px] justify-center w-full max-w-[800px]">
          <div
            className="relative inline-block w-[32%] max-w-[32%]"
            ref={dropdownRef}
          >
            <div
              className={
                isOpen
                  ? "appearance-none pl-12 pr-3 py-2 rounded-tl-3xl bg-cordovan cursor-pointer flex items-center justify-center transition-transform duration-350"
                  : "appearance-none pl-12 pr-3 py-2 rounded-l-full bg-cordovan cursor-pointer flex items-center justify-center transition-transform duration-350"
              }
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="truncate">
                {server === "default"
                  ? t("findPlayer:server")
                  : serverNames[server]}
              </span>
              <IoMdArrowDropdown className="text-[42px]  " />
            </div>
            {isOpen && (
              <ul className="absolute w-full bg-cordovan rounded-b-3xl text-center">
                <li
                  className="px-4 py-1 cursor-pointer hover:bg-cordovan-light"
                  onClick={() => handleSelect("eun1")}
                >
                  EUNE
                </li>
                <li
                  className="px-4 py-1 cursor-pointer hover:bg-cordovan-light"
                  onClick={() => handleSelect("euw1")}
                >
                  EUW
                </li>
                <li
                  className="px-4 py-1 cursor-pointer hover:bg-cordovan-light hover:rounded-b-3xl"
                  onClick={() => handleSelect("na1")}
                >
                  NA
                </li>
              </ul>
            )}
          </div>
          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-[18%] max-w-[18%] text-center text-gray-100 px-3 bg-cordovan border-l-gray-100 border-l-4 placeholder-gray focus:outline-none "
          />
          <input
            type="text"
            placeholder={t("findPlayer:username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[50%] max-w-[50%] text-center text-gray-100 px-3 bg-cordovan border-l-gray-100 border-l-4 placeholder-gray rounded-r-full focus:outline-none "
          />
        </div>

        <button
          type="submit"
          className="mt-6 text-gray-100 bg-oxford-blue px-5 py-2 text-[24px] w-[25%] rounded-full mx-auto hover:scale-105 transition-all duration-150 shadow-gray-900 shadow-lg"
        >
          {t("findPlayer:search")}
        </button>
      </form>
    </div>
  );
};

export default FindPlayer;
