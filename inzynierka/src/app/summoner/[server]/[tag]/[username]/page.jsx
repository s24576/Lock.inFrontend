"use client";
import React, { useContext, useState, useEffect } from "react";
import { SearchContext } from "@/app/context/SearchContext";
import axios from "axios";
import { useParams, redirect } from "next/navigation";
import Image from "next/image";

const SearchPage = () => {
  const {
    paramsData,
    playerData,
    masteryData,
    rankData,
    setPlayerData,
    setMasteryData,
    setRankData,
  } = useContext(SearchContext);

  const [championIds, setChampionIds] = useState([]);
  const [championsFetched, setChampionsFetched] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (!playerData.id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchChampionIds = async () => {
    console.log("masterydata", masteryData);
    const updatedMasteryData = [];

    for (let i = 0; i < masteryData.length; i++) {
      var champId = masteryData[i].championId;
      console.log(masteryData.length);

      const champResponse = await axios.get(
        `http://localhost:8080/ddragon/getChampionId?championId=${champId}`
      );

      console.log(champResponse.data);

      // nadpisanie championId w masteryData nazwa championa zamiast numeru id
      const updatedMasteryItem = {
        ...masteryData[i],
        championId: champResponse.data,
      };

      updatedMasteryData.push(updatedMasteryItem);
    }
    setMasteryData(updatedMasteryData);

    setChampionsFetched(true);
    setLoading(false);
  };

  if (masteryData.length > 0 && !championsFetched) {
    console.log("sss", championIds);
    fetchChampionIds();
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

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1>Summoner</h1>
      <p>Server: {params.server}</p>
      <p>Tag: {params.tag}</p>
      <p>Username: {decodeURIComponent(params.username)}</p>
      <div className="flex gap-x-5 mt-5">
        {masteryData &&
          masteryData.map((mastery, key) => {
            return (
              <div key={key}>
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
                    mastery.championId +
                    "_0.jpg"
                  }
                  width={200}
                  height={200}
                  alt={mastery.championId}
                />
                <p>Champion Id: {mastery.championId}</p>
                <p>CHampion mastery: {mastery.championLevel}</p>
              </div>
            );
          })}
      </div>
      <div className="flex gap-x-5 mt-5">
        {rankData &&
          rankData.map((rank, key) => {
            return (
              <div key={key}>
                <p>
                  {rank.tier} {rank.rank}
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
            );
          })}
      </div>
    </div>
  );
};

export default SearchPage;
