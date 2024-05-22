"use client";
import React, { useEffect, useState, useContext } from "react";
import { useParams, redirect } from "next/navigation";
import axios from "axios";
import fetchData from "../api/riot/getMatchInfo";
import findByPuuid from "../api/riot/findByPuuid";
import Image from "next/image";
import { SearchContext } from "../context/SearchContext";

const MatchDetails = () => {
  const [matchData, setMatchData] = useState({});
  const { version } = useContext(SearchContext);
  const params = useParams();

  useEffect(() => {
    const getMatchData = async () => {
      try {
        const data = await fetchData(params.matchId);
        console.log(data);
        setMatchData(data);
      } catch (error) {
        console.error(error);
      }
    };

    getMatchData();
  }, [params.matchId]);

  const handleFindByPuuid = async (matchId, puuid) => {
    try {
      const data = await findByPuuid(matchId, puuid);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center text-white">
      {Object.keys(matchData).length > 0 ? (
        <div>
          <h1 className="py-2 text-[24px]">Match Details</h1>
          <div>
            {matchData.info.participants.map((participant, index) => {
              return (
                <div key={index} className="flex gap-x-3">
                  <p
                    onClick={() =>
                      handleFindByPuuid(params.matchId, participant.puuid)
                    }
                    className="cursor-pointer"
                  >
                    {participant.summonerName}
                  </p>
                  <p>
                    {participant.kills}/{participant.deaths}/
                    {participant.assists}
                  </p>
                  <div className="flex">
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/item/" +
                        participant.item0 +
                        ".png"
                      }
                      width={30}
                      height={30}
                      alt={participant.item0}
                    />
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/item/" +
                        participant.item1 +
                        ".png"
                      }
                      width={30}
                      height={30}
                      alt={participant.item1}
                    />
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/item/" +
                        participant.item2 +
                        ".png"
                      }
                      width={30}
                      height={30}
                      alt={participant.item2}
                    />
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/item/" +
                        participant.item3 +
                        ".png"
                      }
                      width={30}
                      height={30}
                      alt={participant.item3}
                    />
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/item/" +
                        participant.item4 +
                        ".png"
                      }
                      width={30}
                      height={30}
                      alt={participant.item4}
                    />
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/item/" +
                        participant.item5 +
                        ".png"
                      }
                      width={30}
                      height={30}
                      alt={participant.item5}
                    />
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/item/" +
                        participant.item6 +
                        ".png"
                      }
                      width={30}
                      height={30}
                      alt={participant.item6}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
