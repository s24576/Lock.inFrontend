"use client";
import { SearchContext } from "../../context/SearchContext";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getSummonerSpell } from "@/lib/getSummonerSpell";
import { useTranslation } from "react-i18next";
import { useContext } from "react";

const multiKill = (kills) => {
  switch (kills) {
    case "3":
      return "TRIPLE KILL";
    case "4":
      return "QUADRA KILL";
    case "5":
      return "PENTA KILL";
    default:
      return "";
  }
};

const gamemode = (gameMode) => {
  switch (gameMode) {
    case "5v5 Ranked Flex games":
      return "Ranked Flex";
    case "5v5 Ranked Solo games":
      return "Ranked Solo";
    case "5v5 ARAM games":
      return "ARAM";
    default:
      return "Game";
  }
};

const ShortMatch = ({ match }) => {
  const { t } = useTranslation();
  const { version } = useContext(SearchContext);

  return (
    <div
      className={`h-[80px] w-[100%] border-[1px] rounded-2xl flex items-center px-3 transition-colors duration-100 ${
        match.win ? "border-amber" : "border-white-smoke"
      } hover:bg-white-smoke hover:bg-opacity-5`}
    >
      <div className="">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/champion/" +
            match.championName +
            ".png"
          }
          height={55}
          width={55}
          className="rounded-full border-[1px] border-amber"
          alt="test"
        />
      </div>
      <div className="flex flex-col gap-y-1 ml-3 w-[5%]">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/spell/" +
            getSummonerSpell(match.summonerId1) +
            ".png"
          }
          height={24}
          width={24}
          alt="test"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/spell/" +
            getSummonerSpell(match.summonerId2) +
            ".png"
          }
          height={24}
          width={24}
          alt="test"
        />
      </div>
      <div className="flex flex-col justify-center ml-3 w-[15%]">
        <p className="text-[24px]">
          {match.kills + "/" + match.deaths + "/" + match.assists}
        </p>
        <p className="text-[16px]">
          KDA: {((match.kills + match.assists) / match.deaths).toFixed(2)}:
          {match.deaths}
        </p>
      </div>
      <div className="flex flex-col justify-center ml-4 w-[15%]">
        <p className="text-[16px]">CS: {match.cs}</p>
        <p className="text-[16px]">
          KP:{" "}
          {(((match.kills + match.assists) / match.totalKills) * 100).toFixed(
            0
          )}
          %
        </p>
        <p className="text-[14px] text-amber">{multiKill(match.multiKill)}</p>
      </div>
      <div className="grid grid-cols-3 gap-y-2 gap-x-1 ml-4">
        {match.item0 !== 0 ? (
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.item0 +
              ".png"
            }
            height={28}
            width={28}
            className="border-[1px] border-white-smoke"
            alt={match.item0}
          />
        ) : (
          <div className="border-[1px] border-white-smoke w-[28px] h-[28px]" />
        )}
        {match.item1 !== "0" ? (
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.item1 +
              ".png"
            }
            height={28}
            width={28}
            className="border-[1px] border-white-smoke"
            alt={match.item1}
          />
        ) : (
          <div className="border-[1px] border-white-smoke w-[28px] h-[28px]" />
        )}
        {match.item2 !== "0" ? (
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.item2 +
              ".png"
            }
            height={28}
            width={28}
            className="border-[1px] border-white-smoke"
            alt={match.item2}
          />
        ) : (
          <div className="border-[1px] border-white-smoke w-[28px] h-[28px]" />
        )}
        {match.item3 !== "0" ? (
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.item3 +
              ".png"
            }
            height={28}
            width={28}
            className="border-[1px] border-white-smoke"
            alt={match.item3}
          />
        ) : (
          <div className="border-[1px] border-white-smoke w-[28px] h-[28px]" />
        )}
        {match.item4 !== "0" ? (
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.item4 +
              ".png"
            }
            height={28}
            width={28}
            className="border-[1px] border-white-smoke"
            alt={match.item4}
          />
        ) : (
          <div className="border-[1px] border-white-smoke w-[28px] h-[28px]" />
        )}
        {match.item5 !== "0" ? (
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.item5 +
              ".png"
            }
            height={28}
            width={28}
            className="border-[1px] border-white-smoke"
            alt={match.item5}
          />
        ) : (
          <div className="border-[1px] border-white-smoke w-[28px] h-[28px]" />
        )}
      </div>
      <div className="ml-2">
        {match.item6 !== "0" ? (
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.item6 +
              ".png"
            }
            height={28}
            width={28}
            className="border-[1px] border-white-smoke"
            alt={match.item6}
          />
        ) : (
          <div className="border-[1px] border-white-smoke w-[28px] h-[28px]" />
        )}
      </div>
      <div className="flex flex-col justify-center items-center ml-4 text-[16px] w-[20%]">
        <p>{gamemode(match.queueType)}</p>
        <p className="text-nowrap text-[14px]">
          {formatDistanceToNow(new Date(match.timestamp), { addSuffix: true })}
        </p>

        <div className="flex items-center gap-x-1">
          <p className={match.win ? "text-amber" : "text-white-smoke"}>
            {match.win === true ? t("riot:victory") : t("riot:defeat")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortMatch;
