"use client";
import React, { useContext, useState, useEffect } from "react";
import { SearchContext } from "@/app/[locale]/context/SearchContext";
import axios from "axios";
import { useParams, redirect } from "next/navigation";
import Image from "next/image";
import { UserContext } from "@/app/[locale]/context/UserContext";
import Link from "next/link";
import getChampionNameById from "../api/ddragon/getChampionNameById";
import getQueues from "../api/ddragon/getQueues";
import { BiWorld } from "react-icons/bi";
import { FaLock, FaUnlock } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { GoLock } from "react-icons/go";
import { MdOutlineRefresh } from "react-icons/md";

const SummonerProfile = () => {
  const {
    paramsData,
    playerData,
    masteryData,
    rankData,
    lastMatches,
    setPlayerData,
    setMasteryData,
    setRankData,
    matchHistoryData,
    setMatchHistoryData,
    setLastMatches,
    version,
  } = useContext(SearchContext);

  const { userData, setUserData, isLogged } = useContext(UserContext);

  const [championIds, setChampionIds] = useState([]);
  const [championsFetched, setChampionsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [queueList, setQueueList] = useState("");

  const params = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/riot/findPlayer?server=${params.server}&tag=${params.tag}&name=${params.username}`
      );

      setPlayerData(response.data);
      console.log(response.data);

      const masteryResponse = await axios.get(
        `http://localhost:8080/riot/getChampionMastery?server=${params.server}&puuid=${response.data.puuid}`
      );

      setMasteryData(masteryResponse.data);
      console.log(masteryResponse.data);

      const rankResponse = await axios.get(
        `http://localhost:8080/riot/getRanks?server=${params.server}&summonerId=${response.data.id}`
      );

      setRankData(rankResponse.data);
      console.log(rankResponse.data);

      const matchHistoryResponse = await axios.get(
        `http://localhost:8080/riot/getMatchHistory?puuid=${response.data.puuid}`
      );

      setMatchHistoryData(matchHistoryResponse.data);
      console.log(matchHistoryResponse.data);

      for (let i = 0; i < matchHistoryResponse.data.length; i++) {
        const matchDetailsResponse = await axios.get(
          `http://localhost:8080/riot/getMatchInfo?matchId=${matchHistoryResponse.data[i]}`
        );
        console.log(matchDetailsResponse.data);
        setLastMatches((prevMatches) => [
          ...prevMatches,
          matchDetailsResponse.data,
        ]);
        console.log(lastMatches);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    if (!playerData.id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getQ = async () => {
      try {
        const data = await getQueues();
        setQueueList(data);
      } catch (error) {
        console.log(error);
      }
    };
    getQ();
  }, []);

  const fetchChampionNames = async () => {
    try {
      const data = await getChampionNameById(masteryData);
      setMasteryData(data);

      setChampionsFetched(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNamesForMatches = async () => {
    try {
    } catch (error) {}
  };

  if (masteryData.length > 0 && !championsFetched) {
    fetchChampionNames();
    setChampionsFetched(true);
    setLoading(false);
  }

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
      try {
        const response = await axios.put(
          `http://localhost:8080/profile/addWatchList?puuid=${playerData.puuid}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        console.log(response.data);
        setUserData((prevUserData) => ({
          ...prevUserData,
          watchList: response.data,
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrorMessage("Log in to follow other summoner");
    }
  };

  const unfollowSummoner = async () => {
    if (isLogged) {
      try {
        const response = await axios.put(
          `http://localhost:8080/profile/removeWatchList?puuid=${playerData.puuid}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        console.log(response.data);
        setUserData((prevUserData) => ({
          ...prevUserData,
          watchList: response.data,
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrorMessage("Log in to unfollow other summoner");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-linen">
      <div className="mt-[80px] py-6 px-4 w-[80%] flex justify-between items-center bg-cordovan rounded-3xl">
        <div className="flex items-center gap-x-3 ml-[15%]">
          <BiWorld className="text-[60px]"></BiWorld>
          <p className="text-[48px]">{params.server}</p>
        </div>
        <div className="flex items-center gap-x-12">
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/" +
              playerData.profileIconId +
              ".png"
            }
            width={150}
            height={150}
            alt="summonerIcon"
            className="rounded-full border-2 border-white"
          />
          <div className="flex flex-col items-center justify-center">
            <p className="text-[48px] font-semibold">
              {decodeURIComponent(params.username)}
            </p>
            <p className="text-[40px]">#{params.tag}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-x-3  mr-[15%]">
          <MdOutlineRefresh className="text-[64px] cursor-pointer" />
          <GoLock className="text-[60px] cursor-pointer"></GoLock>
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

      <div className="flex w-[80%]">
        <div className="flex flex-col w-[35%]">
          <div className="mt-8 flex justify-center gap-x-8 bg-oxford-blue py-4 rounded-3xl">
            {Array.isArray(rankData) && rankData.length > 0 ? (
              rankData.map((rank, key) => (
                <div key={key} className="flex flex-col items-center">
                  <p>{rank.queueType}</p>
                  <Image src="/diamondRank.png" width={110} height={110} />
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
          <div className="mt-8 flex justify-center items-center gap-x-6 bg-oxford-blue py-4 rounded-3xl">
            {Array.isArray(masteryData) && masteryData.length > 1 ? (
              masteryData.map((mastery, key) => (
                <div key={key} className="flex flex-col items-center">
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/" +
                      version +
                      "/img/champion/" +
                      mastery.championId +
                      ".png"
                    }
                    width={120}
                    height={120}
                    alt={mastery.championId}
                    className="rounded-full"
                  />
                  <Image src="/masteryPlaceholder.png" width={60} height={60} />
                  <p>{(mastery.championPoints / 1000).toFixed(1) + "k"}</p>
                </div>
              ))
            ) : (
              <p>No mastery data available</p>
            )}
          </div>
        </div>
        <div className="ml-[5%] mt-8 w-[60%] bg-oxford-blue rounded-3xl flex flex-col gap-y-6 items-center justify-center">
          {Array.isArray(lastMatches) && lastMatches.length > 0 ? (
            lastMatches.map((match, key) => {
              return (
                <div
                  className="flex items-center gap-x-4 bg-air-force-blue w-[90%] py-1 px-8 rounded-3xl"
                  key={key}
                >
                  {match.info.participants.map((participant, key) => {
                    if (participant.puuid === playerData.puuid) {
                      return (
                        <div key={key} className="flex gap-x-8 items-center">
                          <Image
                            src={
                              "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/" +
                              participant.championName +
                              ".png"
                            }
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <p
                            className={
                              participant.win
                                ? "text-[#1FFB28] font-semibold text-[24px] w-[100px] text-center"
                                : "text-[#DF1A0D] font-semibold text-[24px] w-[100px] text-center"
                            }
                          >
                            {participant.win ? "Victory" : "Loss"}
                          </p>
                        </div>
                      );
                    }
                  })}
                  {match.info.queueId &&
                    queueList &&
                    queueList.map((queue, key) => {
                      if (match.info.queueId == queue.queueId) {
                        return (
                          <p
                            key={key}
                            className="w-[200px] text-center font-bold text-[20px]"
                          >
                            {queue.description.includes("games")
                              ? queue.description.replace("games", "")
                              : queue.description}
                          </p>
                        );
                      }
                    })}
                  {match.info.participants.map((participant, key) => {
                    if (participant.puuid === playerData.puuid) {
                      return (
                        <div key={key} className="flex gap-x-3 items-center">
                          <p className="w-[100px] text-center font-bold text-[24px]">
                            {" "}
                            {participant.kills}/{participant.deaths}/
                            {participant.assists}
                          </p>
                          <Link
                            href={"/match/" + match.metadata.matchId}
                            className="ml-10 bg-arg-blue py-1 px-4 text-[24px] rounded-full hover:bg-arg-blue-dark"
                          >
                            See more
                          </Link>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })
          ) : (
            <p>No data for your last matches</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummonerProfile;
