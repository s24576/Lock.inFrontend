import React, { useContext } from "react";
import { useQuery, useMutation } from "react-query";
import getMatchInfo from "../../api/riot/getMatchInfo";
import useAxios from "../../hooks/useAxios";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { UserContext } from "../../context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { getSummonerSpell } from "@/lib/getSummonerSpell";
import { getRuneIcon } from "@/lib/getRuneIcon";
import findByPuuid from "../../api/riot/findByPuuid";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const FullMatch = ({ matchId }) => {
  const { isLogged } = useContext(UserContext);
  const { t } = useTranslation();

  const router = useRouter();
  const axios = useAxios();
  const axiosPublic = useAxiosPublic();
  const axiosInstance = isLogged ? axios : axiosPublic;

  const {
    data: matchData,
    isLoading: matchLoading,
    error: matchError,
    refetch: matchRefetch,
  } = useQuery("matchData", () => getMatchInfo(axiosInstance, matchId), {
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: findAnotherProfile } = useMutation(
    (puuid) => findByPuuid(axiosInstance, matchData.metadata.server, puuid),
    {
      onSuccess: (data) => {
        router.push(
          "/summoner/" + data.server + "/" + data.tagLine + "/" + data.gameName
        );
      },
      onError: (error) => {
        console.error("Error claiming/unclaiming:", error);
      },
    }
  );

  if (matchLoading) {
    return (
      <div className="relative w-full min-h-[200px] bg-night rounded-2xl border-[1px] border-white-smoke flex justify-center items-center">
        <AiOutlineLoading3Quarters className="text-[24px] animate-spin" />
      </div>
    );
  }

  if (matchData && !matchLoading) {
    return (
      <div className="relative w-full min-h-[200px] bg-night rounded-2xl border-[1px] border-white-smoke flex flex-col gap-y-2 items-center px-[3%] py-[1%] text-white-smoke">
        {matchData.info.participants.map((participant, key) => {
          if (participant.teamId === "100") {
            return (
              <div
                key={key}
                className={`w-full flex items-center px-2 py-2 rounded-xl ${
                  participant.win
                    ? "bg-amber bg-opacity-15"
                    : "bg-silver bg-opacity-15"
                }`}
              >
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/" +
                    participant.championName +
                    ".png"
                  }
                  height={32}
                  width={32}
                  alt="champioName"
                />
                <div className="flex flex-col gap-y-1 ml-2">
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/" +
                      getSummonerSpell(participant.summoner1Id) +
                      ".png"
                    }
                    height={20}
                    width={20}
                    alt="test"
                  />
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/" +
                      getSummonerSpell(participant.summoner2Id) +
                      ".png"
                    }
                    height={20}
                    width={20}
                    alt="test"
                  />
                </div>
                <div className="flex flex-col gap-y-1 ml-1 items-center">
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/img/" +
                      getRuneIcon(
                        participant.perks.styles[0].selections[0].perk
                      )
                    }
                    height={24}
                    width={24}
                    alt="test"
                  />
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/img/" +
                      getRuneIcon(participant.perks.styles[1].style)
                    }
                    height={20}
                    width={20}
                    alt="test"
                  />
                </div>
                <div className="flex flex-col  ml-1 w-[28%]">
                  <p
                    onClick={() => findAnotherProfile(participant.puuid)}
                    className="text-[20px] cursor-pointer hover:text-amber duration-150 transition-all"
                  >
                    {participant.summonerName.length > 16
                      ? `${participant.summonerName.substring(0, 16)}...`
                      : participant.summonerName}
                  </p>
                  <p className="text-[14px] text-silver">
                    {participant.rank && participant.tier !== null
                      ? participant.tier + " " + participant.rank
                      : "Unranked"}
                  </p>
                </div>
                <div className="flex flex-col justify-center w-[15%]">
                  <p className="text-[20px]">
                    {participant.kills +
                      "/" +
                      participant.deaths +
                      "/" +
                      participant.assists}
                  </p>
                  <p className="text-[14px] text-silver">
                    KDA:{" "}
                    {(
                      (participant.kills + participant.assists) /
                      participant.deaths
                    ).toFixed(2)}
                    :{participant.deaths}
                  </p>
                </div>
                <div className="flex items-center gap-x-1 w-[40%]">
                  {participant.item0 !== 0 ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item0 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item0}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item1 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item1 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item1}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item2 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item2 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item2}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item3 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item3 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item3}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item4 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item4 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item4}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item5 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item5 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item5}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item6 !== 0 ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item6 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item6}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                </div>
              </div>
            );
          }
        })}
        <div className="w-full min-h-[200px] flex justify-between px-[5%]">
          <div className="w-[20%] flex flex-col gap-y-2 pt-4 text-nowrap">
            <p>
              {t("riot:heralds")}
              {matchData.info.teams[0].objectives.riftHerald.kills}
            </p>
            <p>
              {t("riot:viodgrubs")}{" "}
              {matchData.info.teams[0].objectives.horde.kills}
            </p>
            <p>
              {t("riot:towers")}{" "}
              {matchData.info.teams[0].objectives.tower.kills}
            </p>
            <p>
              {t("riot:inhibitors")}{" "}
              {matchData.info.teams[0].objectives.inhibitor.kills}
            </p>
            <p
              className={`font-bangers text-[24px] ${
                matchData.info.teams[0].win ? "text-amber" : "text-silver"
              }`}
            >
              {matchData.info.teams[0].win
                ? t("riot:victory")
                : t("riot:defeat")}
            </p>
          </div>
          <div className="w-[50%] flex flex-col items-center gap-y-2 pt-4">
            <div className="w-full flex-col flex items-center">
              <p>{t("riot:totalKills")}</p>
              <div className="w-full flex">
                <div
                  className={`h-[24px] flex justify-start ${
                    matchData.info.teams[0].win ? "bg-amber" : "bg-silver"
                  }`}
                  style={{
                    width: `${
                      (matchData.info.teams[0].objectives.champion.kills /
                        (matchData.info.teams[0].objectives.champion.kills +
                          matchData.info.teams[1].objectives.champion.kills ||
                          1)) *
                      100
                    }%`, // Dodajemy || 1, aby uniknąć dzielenia przez zero
                  }}
                >
                  <p className="text-night pl-2">
                    {matchData.info.teams[0].objectives.champion.kills}
                  </p>
                </div>
                <div
                  className={`h-[24px] flex justify-end ${
                    matchData.info.teams[1].win ? "bg-amber" : "bg-silver"
                  }`}
                  style={{
                    width: `${
                      (matchData.info.teams[1].objectives.champion.kills /
                        (matchData.info.teams[0].objectives.champion.kills +
                          matchData.info.teams[1].objectives.champion.kills ||
                          1)) *
                      100
                    }%`, // Dodajemy || 1, aby uniknąć dzielenia przez zero
                  }}
                >
                  <p className="text-night pr-2">
                    {matchData.info.teams[1].objectives.champion.kills}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex-col flex items-center">
              <p>{t("riot:barons")}</p>
              <div className="w-full flex">
                <div
                  className={`h-[24px] flex justify-start ${
                    matchData.info.teams[0].win ? "bg-amber" : "bg-silver"
                  }`}
                  style={{
                    // Jeśli suma baronów wynosi 0, ustawiamy szerokości na 50%/50%, w przeciwnym razie obliczamy normalnie
                    width: `${
                      matchData.info.teams[0].objectives.baron.kills === 0 &&
                      matchData.info.teams[1].objectives.baron.kills === 0
                        ? 50 // Jeśli obie drużyny mają 0 baronów, ustawiamy 50%/50%
                        : (matchData.info.teams[0].objectives.baron.kills /
                            (matchData.info.teams[0].objectives.baron.kills +
                              matchData.info.teams[1].objectives.baron.kills ||
                              1)) *
                          100
                    }%`,
                  }}
                >
                  <p className="text-night pl-2">
                    {matchData.info.teams[0].objectives.baron.kills}
                  </p>
                </div>
                <div
                  className={`h-[24px] flex justify-end ${
                    matchData.info.teams[1].win ? "bg-amber" : "bg-silver"
                  }`}
                  style={{
                    // Jeśli suma baronów wynosi 0, ustawiamy szerokości na 50%/50%, w przeciwnym razie obliczamy normalnie
                    width: `${
                      matchData.info.teams[0].objectives.baron.kills === 0 &&
                      matchData.info.teams[1].objectives.baron.kills === 0
                        ? 50 // Jeśli obie drużyny mają 0 baronów, ustawiamy 50%/50%
                        : (matchData.info.teams[1].objectives.baron.kills /
                            (matchData.info.teams[0].objectives.baron.kills +
                              matchData.info.teams[1].objectives.baron.kills ||
                              1)) *
                          100
                    }%`,
                  }}
                >
                  <p className="text-night pr-2">
                    {matchData.info.teams[1].objectives.baron.kills}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex-col flex items-center">
              <p>{t("riot:dragons")}</p>
              <div className="w-full flex">
                <div
                  className={`h-[24px] flex justify-start ${
                    matchData.info.teams[0].win ? "bg-amber" : "bg-silver"
                  }`}
                  style={{
                    // Jeśli suma baronów wynosi 0, ustawiamy szerokości na 50%/50%, w przeciwnym razie obliczamy normalnie
                    width: `${
                      matchData.info.teams[0].objectives.dragon.kills === 0 &&
                      matchData.info.teams[1].objectives.dragon.kills === 0
                        ? 50 // Jeśli obie drużyny mają 0 baronów, ustawiamy 50%/50%
                        : (matchData.info.teams[0].objectives.dragon.kills /
                            (matchData.info.teams[0].objectives.dragon.kills +
                              matchData.info.teams[1].objectives.dragon.kills ||
                              1)) *
                          100
                    }%`,
                  }}
                >
                  <p className="text-night pl-2">
                    {matchData.info.teams[0].objectives.dragon.kills}
                  </p>
                </div>
                <div
                  className={`h-[24px] flex justify-end ${
                    matchData.info.teams[1].win ? "bg-amber" : "bg-silver"
                  }`}
                  style={{
                    // Jeśli suma baronów wynosi 0, ustawiamy szerokości na 50%/50%, w przeciwnym razie obliczamy normalnie
                    width: `${
                      matchData.info.teams[0].objectives.dragon.kills === 0 &&
                      matchData.info.teams[1].objectives.dragon.kills === 0
                        ? 50 // Jeśli obie drużyny mają 0 baronów, ustawiamy 50%/50%
                        : (matchData.info.teams[1].objectives.dragon.kills /
                            (matchData.info.teams[0].objectives.dragon.kills +
                              matchData.info.teams[1].objectives.dragon.kills ||
                              1)) *
                          100
                    }%`,
                  }}
                >
                  <p className="text-night pr-2">
                    {matchData.info.teams[1].objectives.dragon.kills}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[20%] flex flex-col items-end  gap-y-2 pt-4 text-nowrap">
            <p>
              {t("riot:heralds")}
              {matchData.info.teams[1].objectives.riftHerald.kills}
            </p>
            <p>
              {t("riot:voidgrubs")}{" "}
              {matchData.info.teams[1].objectives.horde.kills}
            </p>
            <p>
              {t("riot:towers")}{" "}
              {matchData.info.teams[1].objectives.tower.kills}
            </p>
            <p>
              {t("riot:inhibitors")}{" "}
              {matchData.info.teams[1].objectives.inhibitor.kills}
            </p>
            <p
              className={`font-bangers text-[24px] ${
                matchData.info.teams[1].win ? "text-amber" : "text-silver"
              }`}
            >
              {matchData.info.teams[1].win
                ? t("riot:victory")
                : t("riot:defeat")}
            </p>
          </div>
        </div>
        {matchData.info.participants.map((participant, key) => {
          if (participant.teamId === "200") {
            return (
              <div
                key={key}
                className={`w-full flex items-center px-2 py-2 rounded-xl ${
                  participant.win
                    ? "bg-amber bg-opacity-15"
                    : "bg-silver bg-opacity-15"
                }`}
              >
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/" +
                    participant.championName +
                    ".png"
                  }
                  height={32}
                  width={32}
                  alt="champioName"
                />
                <div className="flex flex-col gap-y-1 ml-2">
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/" +
                      getSummonerSpell(participant.summoner1Id) +
                      ".png"
                    }
                    height={20}
                    width={20}
                    alt="test"
                  />
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/" +
                      getSummonerSpell(participant.summoner2Id) +
                      ".png"
                    }
                    height={20}
                    width={20}
                    alt="test"
                  />
                </div>
                <div className="flex flex-col gap-y-1 ml-1 items-center">
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/img/" +
                      getRuneIcon(
                        participant.perks.styles[0].selections[0].perk
                      )
                    }
                    height={24}
                    width={24}
                    alt="test"
                  />
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/img/" +
                      getRuneIcon(participant.perks.styles[1].style)
                    }
                    height={20}
                    width={20}
                    alt="test"
                  />
                </div>
                <div className="flex flex-col  ml-1 w-[28%]">
                  <p
                    onClick={() => findAnotherProfile(participant.puuid)}
                    className="text-[20px] cursor-pointer hover:text-amber duration-150 transition-all"
                  >
                    {participant.summonerName.length > 16
                      ? `${participant.summonerName.substring(0, 16)}...`
                      : participant.summonerName}
                  </p>
                  <p className="text-[14px] text-silver">
                    {participant.rank && participant.tier !== null
                      ? participant.tier + " " + participant.rank
                      : "Unranked"}
                  </p>
                </div>
                <div className="flex flex-col justify-center w-[15%]">
                  <p className="text-[20px]">
                    {participant.kills +
                      "/" +
                      participant.deaths +
                      "/" +
                      participant.assists}
                  </p>
                  <p className="text-[14px] text-silver">
                    KDA:{" "}
                    {(
                      (participant.kills + participant.assists) /
                      participant.deaths
                    ).toFixed(2)}
                    :{participant.deaths}
                  </p>
                </div>
                <div className="flex items-center gap-x-1 w-[40%]">
                  {participant.item0 !== 0 ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item0 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item0}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item1 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item1 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item1}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item2 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item2 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item2}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item3 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item3 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item3}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item4 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item4 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item4}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item5 !== "0" ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item5 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item5}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                  {participant.item6 !== 0 ? (
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/" +
                        participant.item6 +
                        ".png"
                      }
                      height={28}
                      width={28}
                      className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px]"
                      alt={participant.item6}
                    />
                  ) : (
                    <div className="border-[1px] border-white-smoke w-[20px] h-[20px] 2xl:h-[28px] 2xl:w-[28px] min-w-[20px] min-h-[20px] 2xl:min-w-[28px] 2xl:min-h-[28px]" />
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }
};

export default FullMatch;
