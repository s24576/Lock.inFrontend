"use client";
import React, { useContext, useState, useEffect } from "react";
import { SearchContext } from "@/app/context/SearchContext";
import axios from "axios";
import { useParams, redirect } from "next/navigation";
import Image from "next/image";
import { UserContext } from "@/app/context/UserContext";
import Link from "next/link";
import getChampionNameById from "@/app/api/ddragon/getChampionNameById";
import getQueues from "../api/ddragon/getQueues";

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
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1>Summoner</h1>
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
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <p>Server: {params.server}</p>
      <p>Tag: {params.tag}</p>
      {/* username nie bierze duzej litery jesli sie nie wpisze duza */}
      <p>Username: {decodeURIComponent(params.username)} </p>
      <div className="flex gap-x-5 mt-5">
        {Array.isArray(masteryData) && masteryData.length > 1 ? (
          masteryData.map((mastery, key) => (
            <div key={key}>
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/champion/" +
                  mastery.championId +
                  ".png"
                }
                width={200}
                height={200}
                alt={mastery.championId}
              />
              <p>Champion Id: {mastery.championId}</p>
              <p>Champion mastery: {mastery.championLevel}</p>
            </div>
          ))
        ) : (
          <p>No mastery data available</p>
        )}
      </div>

      <div className="flex gap-x-5 mt-5">
        {Array.isArray(rankData) && rankData.length > 0 ? (
          rankData.map((rank, key) => (
            <div key={key}>
              <p>
                {rank.tier} {rank.rank}{" "}
                {rank.leaguePoints ? rank.leaguePoints + " LP" : "Unranked"}
              </p>
              <p>{rank.queueType}</p>
              <p>
                Wins: {rank.wins} Loses: {rank.losses}
              </p>
              <p>
                Win ratio:{" "}
                {((rank.wins / (rank.wins + rank.losses)) * 100).toFixed(2)}%
              </p>
            </div>
          ))
        ) : (
          <p>No rank data available</p>
        )}
      </div>
      <div className="flex flex-col mt-5 gap-y-2 text-center">
        <p className="text-[32px]">Match history:</p>
        {Array.isArray(lastMatches) && lastMatches.length > 0 ? (
          lastMatches.map((match, key) => {
            return (
              <div className="flex gap-x-4" key={key}>
                {match.info.queueId &&
                  queueList &&
                  queueList.map((queue, key) => {
                    if (match.info.queueId == queue.queueId) {
                      return (
                        <p key={key}>
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
                      <div key={key} className="flex gap-x-3">
                        <p>
                          {participant.kills}/{participant.deaths}/
                          {participant.assists}
                        </p>
                        <p>{participant.win ? "Victory" : "Loss"}</p>
                        <Link href={"/match/" + match.metadata.matchId}>
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
  );
};

export default SummonerProfile;
