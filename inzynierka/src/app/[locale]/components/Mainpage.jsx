"use client";
import React, { useState, useContext, useEffect, act } from "react";
import { UserContext } from "../context/UserContext";
import useAxios from "../hooks/useAxios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SearchContext } from "../context/SearchContext";
import { useQuery } from "react-query";
import {
  FaGlobeAmericas,
  FaGlobeEurope,
  FaGooglePlay,
  FaComment,
  FaBookOpen,
} from "react-icons/fa";
import { BiSolidLock } from "react-icons/bi";
import {
  IoDesktopOutline,
  IoGameControllerOutline,
  IoPeople,
} from "react-icons/io5";
import { RITeamFill, RISwordFill } from "@icongo/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentsShad/ui/select";

const servers = [
  {
    name: "EUNE",
    value: "eun1",
    icon: <FaGlobeEurope className="text-[28px]" />,
  },
  {
    name: "EUW",
    value: "euw1",
    icon: <FaGlobeEurope className="text-[28px]" />,
  },
  {
    name: "NA",
    value: "na1",
    icon: <FaGlobeAmericas className="text-[28px]" />,
  },
];

const tiles = [
  {
    title: "Looking for duo?",
    description:
      "Connect your account and use Lock.in filters to find a perfect partner to play with",
    icon: <IoGameControllerOutline className="text-[64px]" />,
  },

  {
    title: "Let's compete!",
    description: "Join other squad for Clash or find numbers for your team",
    icon: <RITeamFill fill="#F5F5F5" className="text-[64px] " />,
  },

  {
    title: "Chats",
    description:
      "Text with your friends about the game in private or group chats",
    icon: <FaComment className="text-[64px]" />,
  },

  {
    title: "Builds",
    description: "Browse and create builds and strategies for every champion",
    icon: <RISwordFill fill="#F5F5F5" className="text-[64px] " />,
  },

  {
    title: "Courses",
    description:
      "Learn from the best to help you level up your game and climb the ranks",
    icon: <FaBookOpen className="text-[64px]" />,
  },

  {
    title: "Become friends",
    description:
      "Add new people you found on Lock.in or connect with your life-long buddies",
    icon: <IoPeople className="text-[64px]" />,
  },
];

const Mainpage = () => {
  const { userData, isLogged, setUserData, setIsLogged } =
    useContext(UserContext);
  const { version } = useContext(SearchContext);

  const [followedProfiles, setFollowedProfiles] = useState([]);

  const [myAccounts, setMyAccounts] = useState([]);

  const api = useAxios();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await api.get("/user/getUserData");
        if (response.status === 200) {
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...response.data, // Poprawne rozpakowanie danych użytkownika do stanu
          }));
          console.log(response.data);
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Możesz dodać tutaj dodatkową obsługę błędów, jeśli jest potrzebna
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    const fetchFollowed = async () => {
      try {
        const response = await api.get(`/riot/getWatchlistRiotProfiles`);
        console.log("followed profiles:", response.data);
        setFollowedProfiles(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMyAccounts = async () => {
      try {
        const response = await api.get(`/riot/getMyRiotProfiles`);
        console.log("claimed accounts: ", response.data);
        setMyAccounts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFollowed();
    fetchMyAccounts();
  }, []);

  //cache Kicker7
  const { error: findPlayerError, isLoading: findPlayerIsLoading } = useQuery(
    "findPlayer",
    async () => {
      try {
        const response = await api.get(
          `riot/findPlayer?server=eun1&tag=eune&name=Kicker7`
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //cache gbe chief keef
  const { error: findPlayerError2, isLoading: findPlayerIsLoading2 } = useQuery(
    "findPlayer2",
    async () => {
      try {
        const response = await api.get(
          `riot/findPlayer?server=eun1&tag=gbe&name=gbe%20chief%20keef`
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const redirectToProfile = async (puuid, server) => {
    try {
      const response = await api.get(
        `/riot/findPlayer?puuid=${puuid}&server=${server}`
      );
      console.log(response.data);
      if (response.status === 200) {
        router.push(
          `/summoner/${response.data.server}/${response.data.tagLine}/${response.data.gameName}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="flex flex-col font-bangers">
      <div className="h-screen">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url('/mainpage-photo1.webp')`,
            opacity: 0.3,
          }}
        ></div>

        <div className="top-[25%] flex flex-col items-center  gap-y-10 z-10 relative h-full">
          <div className="flex items-center gap-x-8">
            <p className="text-[112px]">Lock.in</p>
            <div className="flex flex-col items-center">
              <p className="text-[32px]">No. 1 League of Legends</p>
              <p className="text-[32px]">Social Media</p>
            </div>
          </div>

          <div
            className="rounded-md"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <form className="flex py-3 pr-6 items-center">
              <Select>
                <SelectTrigger className="flex items-center gap-x-2 bg-transparent text-[24px] text-white-smoke focus:border-none focus:outline-none hover:text-amber px-10 w-[150px]">
                  <FaGlobeAmericas className="text-[28px] "></FaGlobeAmericas>
                  <p>EUNE</p>
                </SelectTrigger>
                <SelectContent
                  className="text-white-smoke mt-2"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                  {servers.map((server, key) => {
                    return (
                      <SelectItem key={key} value={server.value}>
                        <div className="flex font-bangers text-[28px] items-center gap-x-2 hover:bg-transparent">
                          {server.icon}
                          <p className="text-[24px]">{server.name}</p>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <input
                type="text"
                className="border-x-2 border-x-white-smoke px-4 bg-transparent text-white-smoke focus:outline-none text-[24px] placeholder-white-smoke w-[350px]"
                placeholder="Username"
              />
              <input
                type="text"
                className=" px-4 bg-transparent text-white-smoke focus:outline-none text-[24px] placeholder-white-smoke w-[180px]"
                placeholder="Tag"
              />
              <button type="submit">
                <BiSolidLock className="text-[48px] hover:text-amber transition-colors duration-100"></BiSolidLock>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Second div */}
      <div className="h-screen bg-gradient-to-b from-[#1A0E05] to-night to-80% font-chewy flex items-center justify-center px-[8%] gap-x-[8%]">
        <div className="flex flex-col items-center justify-center gap-y-12 w-[35%] ">
          <p className="text-[64px] text-center">
            What are you getting with Lock.in...
          </p>
          <div className="flex items-center gap-x-12">
            <Link
              href="/courses"
              className="flex items-center gap-x-2 hover:text-amber transition-colors duration-100"
            >
              <FaGooglePlay className="text-[28px]"></FaGooglePlay>
              <p className="text-[24px]">Lock.in Mobile</p>
            </Link>

            <Link
              href="/courses"
              className="flex items-center gap-x-2 hover:text-amber transition-colors duration-100"
            >
              <IoDesktopOutline className="text-[28px]"></IoDesktopOutline>
              <p className="text-[24px]">Lock.in Desktop</p>
            </Link>
          </div>
        </div>
        <div className="w-[65%] grid grid-cols-3 gap-8">
          {tiles.map((tile, key) => {
            return (
              <div
                key={key}
                className="flex items-center justify-center gap-x-6 px-3 h-[18vh] border-2 border-white-smoke rounded-xl cursor-pointer hover:bg-white-smoke hover:bg-opacity-5 transition-colors duration-100"
              >
                {tile.icon}
                <div className="flex flex-col gap-y-2 w-[60%] text-center">
                  <p>{tile.title}</p>
                  <p>{tile.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
