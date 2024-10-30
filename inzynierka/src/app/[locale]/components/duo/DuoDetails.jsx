import React, { useState, useContext } from "react";
import { usePathname, useParams } from "next/navigation";
import { useQuery } from "react-query";
import getDuoById from "../../api/duo/getDuoById";
import getRiotShortProfileById from "../../api/riot/getRiotShortProfileById";
import { SearchContext } from "../../context/SearchContext";
import Image from "next/image";

const DuoDetails = () => {
  const pathname = usePathname();
  const params = useParams();

  const { version } = useContext(SearchContext);

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const {
    data: duo,
    error: duoError,
    isLoading: duoIsLoading,
  } = useQuery(
    ["getDuoById", params.duoId],
    () => getDuoById(language, params.duoId),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: riotProfile,
    error: riotProfileError,
    isLoading: riotProfileIsLoading,
  } = useQuery(
    ["getRiotShortProfileById", duo?.puuid],
    () => getRiotShortProfileById(language, duo.puuid),
    {
      enabled: !!duo?.puuid,
      refetchOnWindowFocus: false,
    }
  );

  if (duoIsLoading) {
    return (
      <div className="pt-[100px] h-screen w-full flex flex-col items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-[100px] h-screen w-full flex flex-col items-center text-white">
      <p className="text-[32px]">Duo details</p>
      {riotProfile && (
        <div
          className="flex gap-x-3 items-center"
          onClick={() => {
            router.push(
              `/summoner/${riotProfile.server}/${riotProfile.tagLine}/${riotProfile.gameName}`
            );
          }}
        >
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/profileicon/" +
              riotProfile.profileIconId +
              ".png"
            }
            width={50}
            height={50}
            alt="summonerIcon"
            className="rounded-full border-2 border-white"
          />
          <p>{riotProfile.gameName}</p>
          <p>{riotProfile.summonerLevel} lvl</p>
        </div>
      )}
      {duo && (
        <div className="flex flex-col">
          <p>author: {duo.author}</p>
          <p>champions: {duo.championIds}</p>
          <p>languages: {duo.languages}</p>
          <p>minimum rank: {duo.minRank}</p>
          <p>maximum rank: {duo.maxRank}</p>
          <p>positions: {duo.positions}</p>
          <p>puuid: {duo.puuid}</p>
          <p>duo id: {duo._id}</p>
        </div>
      )}
    </div>
  );
};

export default DuoDetails;
