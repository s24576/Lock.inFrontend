"use client";
import React, { useEffect, useState } from "react";
import { useParams, redirect } from "next/navigation";
import axios from "axios";
import fetchData from "../api/riot/getMatchInfo";
import findByPuuid from "../api/riot/findByPuuid";

const MatchDetails = () => {
  const [matchData, setMatchData] = useState({});
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
