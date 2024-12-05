"use client";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import findByPuuid from "../api/riot/findByPuuid";
import Image from "next/image";
import { SearchContext } from "../context/SearchContext";

const MatchDetails = () => {
  const [matchData, setMatchData] = useState({});
  const { version, queueList } = useContext(SearchContext);
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [redirectData, setRedirectData] = useState({});
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";
  useEffect(() => {
    const getMatchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/riot/getMatchInfo?matchId=${params.matchId}`,
          {
            headers: {
              "Accept-Language": language,
            },
          }
        );
        setMatchData(response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    getMatchData();
  }, [params.matchId]);

  const handleFindByPuuid = async (matchId, puuid) => {
    try {
      const data = await findByPuuid(matchId, puuid);
      setRedirectData(data);
      console.log(data);
      setRedirectToProfile(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (redirectToProfile) {
      router.push(
        `/summoner/${redirectData.server}/${redirectData.tagLine}/${redirectData.gameName}`
      );
    }
  }, [redirectToProfile, redirectData, router]);
  return (
    <div className="w-full min-h-screen flex justify-center  bg-[#131313]">
      {Object.keys(matchData).length > 0 ? (
        <div className="mt-[140px] flex flex-col items-center text-[#f5f5f5]">
          <h1 className="text-[40px] font-semibold">Match Details</h1>
          {matchData.info.queueId &&
            queueList &&
            queueList.map((queue, key) => {
              if (matchData.info.queueId == queue.queueId) {
                return (
                  <p
                    key={key}
                    className="text-center font-semibold text-[32px]"
                  >
                    {queue.description.includes("games")
                      ? queue.description.replace("games", "")
                      : queue.description}
                  </p>
                );
              }
            })}
          <p className="text-[32px] font-semibold">
            {Math.floor(matchData.info.gameDuration / 60)}:
            {Math.floor(matchData.info.gameDuration % 60)}
          </p>

          <div className="flex items-center gap-x-5">
            <div className="flex flex-col  py-8 px-10 gap-y-4 rounded-2xl border-[2px] border-[#f5b800]">
              {matchData.info.participants
                .slice(0, 5)
                .map((participant, index) => {
                  return (
                    <div
                      key={index}
                      className="flex bg-[#131313] text-gray-300 py-1 px-2  items-center rounded-2xl gap-x-2"
                    >
                      <Image
                        src={
                          "https://ddragon.leagueoflegends.com/cdn/" +
                          version +
                          "/img/champion/" +
                          participant.championName +
                          ".png"
                        }
                        width={50}
                        height={50}
                        className="rounded-full"
                        alt={participant.championName}
                      />
                      <div className="flex flex-col ml-2">
                        <Image
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
                            participant.summoner1Name +
                            ".png"
                          }
                          width={24}
                          height={24}
                          alt="summoner_spell1"
                        />
                        <Image
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
                            participant.summoner2Name +
                            ".png"
                          }
                          width={24}
                          height={24}
                          alt="summoner_spell2"
                        />
                      </div>
                      <div>
                        <p
                          onClick={() =>
                            handleFindByPuuid(params.matchId, participant.puuid)
                          }
                          className="cursor-pointer"
                        >
                          {participant.summonerName}
                          {/* ranga tutaj */}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p>
                          {participant.kills}/{participant.deaths}/
                          {participant.assists}
                        </p>
                        <p>
                          {/* {matchData.info.teams[0].objectives.champion.kills} */}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p>
                          CS:{" "}
                          {participant.totalMinionsKilled +
                            participant.neutralMinionsKilled}
                        </p>
                        <p>
                          {(
                            (participant.totalMinionsKilled +
                              participant.neutralMinionsKilled) /
                            (matchData.info.gameDuration / 60)
                          ).toFixed(1)}
                          /min
                        </p>
                      </div>
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
            <div className="flex flex-col">
              <p>X KILLS Y</p>
              <p>X GOLD Y</p>
              <p>X TURRETS Y</p>
              <p>X DRAKES Y</p>
              <p>X BARONS Y</p>
            </div>
            <div className="flex flex-col  py-8 px-10 gap-y-4 rounded-2xl border-[2px] border-[#f5f5f5]">
              {matchData.info.participants
                .slice(5, 10)
                .map((participant, index) => {
                  return (
                    <div
                      key={index}
                      className="flex bg-[#131313] text-gray-300 py-1 px-2  items-center rounded-2xl gap-x-2"
                    >
                      <Image
                        src={
                          "https://ddragon.leagueoflegends.com/cdn/" +
                          version +
                          "/img/champion/" +
                          participant.championName +
                          ".png"
                        }
                        width={50}
                        height={50}
                        className="rounded-full"
                        alt={participant.championName}
                      />
                      <div className="flex flex-col ml-2">
                        <Image
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
                            participant.summoner1Name +
                            ".png"
                          }
                          width={24}
                          height={24}
                          alt="summoner_spell1"
                        />
                        <Image
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
                            participant.summoner2Name +
                            ".png"
                          }
                          width={24}
                          height={24}
                          alt="summoner_spell2"
                        />
                      </div>
                      <div>
                        <p
                          onClick={() =>
                            handleFindByPuuid(params.matchId, participant.puuid)
                          }
                          className="cursor-pointer"
                        >
                          {participant.summonerName}
                          {/* ranga tutaj */}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p>
                          {participant.kills}/{participant.deaths}/
                          {participant.assists}
                        </p>
                        <p>
                          {/* {matchData.info.teams[0].objectives.champion.kills} */}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p>
                          CS:{" "}
                          {participant.totalMinionsKilled +
                            participant.neutralMinionsKilled}
                        </p>
                        <p>
                          {(
                            (participant.totalMinionsKilled +
                              participant.neutralMinionsKilled) /
                            (matchData.info.gameDuration / 60)
                          ).toFixed(1)}
                          /min
                        </p>
                      </div>
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
