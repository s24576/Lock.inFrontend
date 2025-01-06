"use client";
import React, { useContext, useState, useEffect } from "react";
import { SearchContext } from "@/app/[locale]/context/SearchContext";
import axios from "axios";
import useAxios from "../hooks/useAxios";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { UserContext } from "@/app/[locale]/context/UserContext";
import Link from "next/link";
import { BiWorld } from "react-icons/bi";
import { GoLock } from "react-icons/go";
import { MdOutlineRefresh } from "react-icons/md";
import { toast } from "sonner";

const SummonerProfile = () => {
  const { playerData, setPlayerData, version } = useContext(SearchContext);

  const { userData, setUserData, isLogged, setIsLogged } =
    useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [matchesShown, setMatchesShown] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [showMoreButton, setShowMoreButton] = useState(true);

  const params = useParams();
  const pathname = usePathname();
  const api = useAxios();

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

  const fetchData = async () => {
    const langRegex = /^\/([a-z]{2})\//;
    const langMatch = pathname.match(langRegex);
    const language = langMatch ? langMatch[1] : "en";

    try {
      const response = await axios.get(
        `http://localhost:8080/riot/findPlayer?server=${params.server}&tag=${params.tag}&name=${params.username}`,
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );

      setPlayerData(response.data);
      console.log("setplayer data: ", response.data);

      setLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const showMore = async () => {
    console.log(playerData.puuid);
    console.log(filterValue);
    try {
      const response = await axios.get(
        `http://localhost:8080/riot/getMatchHistory?puuid=${
          playerData.puuid
        }&count=${matchesShown + 5}&queue=${filterValue}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (response.data.length % 5 === 0) {
        console.log(response.data);
        setMatchesShown(matchesShown + 5);
        setPlayerData((prevData) => ({
          ...prevData,
          matches: response.data,
        }));
      } else {
        setShowMoreButton(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <p>Loading</p>
      </div>
    );
  }

  const followSummoner = async () => {
    if (isLogged) {
      console.log(userData.token);
      console.log(playerData.puuid);
      const param = playerData.server + "_" + playerData.puuid;
      console.log(param);
      try {
        const response = await api.put(
          `/profile/manageWatchlist?server_puuid=${param}`,
          {}
        );

        console.log(response.data);
        setUserData((prevUserData) => ({
          ...prevUserData,
          watchList: response.data,
        }));
        toast.success("You have followed", {
          duration: 1000,
        });
      } catch (error) {
        toast.error("An error occured", {
          description: error,
          duration: 1000,
        });
        console.log(error);
      }
    } else {
      setErrorMessage("Log in to follow other summoner");
    }
  };

  const unfollowSummoner = async () => {
    if (isLogged) {
      const param = playerData.server + "_" + playerData.puuid;
      try {
        const response = await api.put(
          `/profile/manageWatchlist?server_puuid=${param}`,
          {}
        );

        console.log(response.data);
        setUserData((prevUserData) => ({
          ...prevUserData,
          watchList: response.data,
        }));
        toast.success("You have unfollowed", {
          duration: 1000,
        });
      } catch (error) {
        toast.error("An error occured", {
          description: error,
          duration: 1000,
        });
        console.log(error);
      }
    } else {
      setErrorMessage("Log in to unfollow other summoner");
    }
  };

  const claimAccount = async () => {
    const param = playerData.server + "_" + playerData.puuid;
    try {
      const response = await api.put(
        `/profile/manageMyAccount?server_puuid=${param}`,
        {}
      );

      console.log("account claiming status:", response.status);
      toast.success("You have claimed this account", { duration: 2000 });
    } catch (error) {
      toast.error("An error occured", {
        description: error,
        duration: 2000,
      });
      console.log(error);
    }
  };

  const handleQueueFilter = async (value) => {
    setFilterValue(value);
    setShowMoreButton(true);
    setMatchesShown(5);
    try {
      const response = await axios.get(
        `http://localhost:8080/riot/getMatchHistory?puuid=${playerData.puuid}&queue=${value}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      console.log(response.data);
      setPlayerData((prevData) => ({
        ...prevData,
        matches: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#131313]">
      <div className="mt-[80px] py-6 px-4 w-[80%] flex justify-between items-center rounded-3xl">
        <div className="flex items-center gap-x-3 ml-[15%]">
          <BiWorld className="text-[60px]"></BiWorld>
          <p className="text-[48px]">{playerData.server}</p>
        </div>
        <div className="flex items-center gap-x-12">
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/profileicon/" +
              playerData.profileIconId +
              ".png"
            }
            width={150}
            height={150}
            alt="summonerIcon"
            className="rounded-full border-2 border-white"
          />
          <div className="flex flex-col items-center justify-center">
            <p className="text-[48px] font-semibold">{playerData.gameName}</p>
            <p className="text-[40px]">#{playerData.tagLine}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-x-3  mr-[15%]">
          <MdOutlineRefresh className="text-[64px] cursor-pointer" />
          <GoLock
            onClick={() => claimAccount()}
            className="text-[60px] cursor-pointer"
          ></GoLock>
        </div>
      </div>

      {isLogged && (
        <div className="flex gap-x-3">
          <button
            onClick={followSummoner}
            className="border-2 border-white px-6 py-2 hover:bg-green-600"
          >
            Follow
          </button>
          <button
            onClick={unfollowSummoner}
            className="border-2 border-white px-6 py-2 hover:bg-red-600"
          >
            Unfollow
          </button>
        </div>
      )}

      <div className="w-[80%] flex justify-end">
        <select
          className="text-black w-[20%]"
          value={filterValue}
          onChange={(e) => handleQueueFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="420">Ranked Solo</option>
          <option value="440">Ranked Flex</option>
          <option value="450">ARAM</option>
          <option value="1700">Arena</option>
        </select>
      </div>

      <div className="flex w-[80%]">
        <div className="flex flex-col w-[35%]">
          <div className="mt-8 flex justify-center gap-x-8  py-7 rounded-3xl border-[1px] border-[#f5f5f5]">
            {Array.isArray(playerData.ranks) && playerData.ranks.length > 0 ? (
              playerData.ranks.map((rank, key) => (
                <div key={key} className="flex flex-col items-center">
                  <p>{rank.queueType}</p>
                  <Image
                    src={"/rank_emblems/" + rank.tier + ".png"}
                    width={110}
                    height={110}
                    alt="ranktier"
                  />
                  <p>
                    {rank.tier} {rank.rank}{" "}
                    {rank.leaguePoints ? rank.leaguePoints + " LP" : "Unranked"}
                  </p>
                  <p>
                    {rank.wins} W - {rank.losses} L
                  </p>
                  <p>
                    {((rank.wins / (rank.wins + rank.losses)) * 100).toFixed(2)}
                    % WR
                  </p>
                </div>
              ))
            ) : (
              <p className="h-[206px] flex justify-center items-center">
                No rank data available
              </p>
            )}
          </div>
          <div className="mt-8 flex justify-center items-center gap-x-6  py-7 rounded-3xl border-[1px] border-[#f5f5f5]">
            {Array.isArray(playerData.mastery) &&
            playerData.mastery.length > 1 ? (
              playerData.mastery.map((mastery, key) => (
                <div key={key} className="flex flex-col items-center">
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/" +
                      version +
                      "/img/champion/" +
                      mastery.championName +
                      ".png"
                    }
                    width={120}
                    height={120}
                    alt={mastery.championId}
                    className="rounded-full"
                  />
                  <Image
                    src="/masteryPlaceholder.png"
                    width={60}
                    height={60}
                    alt="mastery"
                  />
                  <p>{(mastery.championPoints / 1000).toFixed(1) + "k"}</p>
                </div>
              ))
            ) : (
              <p>No mastery data available</p>
            )}
          </div>
        </div>
        <div className="ml-[5%] mt-8 w-[60%] py-6  rounded-3xl flex flex-col gap-y-6 items-center justify-center">
          {Array.isArray(playerData.matches) &&
          playerData.matches.length > 0 ? (
            playerData.matches.map((match, index) => {
              return (
                <div
                  key={index}
                  className={
                    match.win
                      ? "flex items-center gap-x-4  w-[90%] py-1 px-8 rounded-3xl border-[1px] border-[#f5b800]"
                      : "flex items-center gap-x-4  w-[90%] py-1 px-8 rounded-3xl border-[1px] border-[#afafaf]"
                  }
                >
                  <div className="flex gap-x-3 items-center">
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/" +
                        match.championName +
                        ".png"
                      }
                      width={60}
                      height={60}
                      className="rounded-full"
                      alt={match.championName}
                    />
                    <p
                      className={
                        match.win
                          ? "text-[#f5b800] font-semibold text-[24px] w-[100px] text-center"
                          : "text-[#afafaf] font-semibold text-[24px] w-[100px] text-center"
                      }
                    >
                      {match.win ? "Victory" : "Loss"}
                    </p>
                  </div>

                  <p className="w-[200px] text-center font-bold text-[20px] text-[#f5f5f5]">
                    {match.queueType}
                  </p>

                  <div className="flex gap-x-3 items-center">
                    <p className="w-[100px] text-center font-bold text-[24px] text-[#f5f5f5]">
                      {" "}
                      {match.kills}/{match.deaths}/{match.assists}
                    </p>
                    <Link
                      href={"/match/" + match.matchId}
                      className="ml-10  py-1 px-4 text-[24px] rounded-full "
                    >
                      See more
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No data for your last matches</p>
          )}
          {showMoreButton && (
            <button
              className="bg-[#f5b800] text-[#131313] py-1 px-10 text-[24px] rounded-md "
              onClick={() => showMore()}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummonerProfile;
