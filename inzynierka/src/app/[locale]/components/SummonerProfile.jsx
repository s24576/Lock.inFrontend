"use client";
import React, { useContext, useState, useEffect } from "react";
import { SearchContext } from "@/app/[locale]/context/SearchContext";
import axios from "axios";
import useAxios from "../hooks/useAxios";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useRouter } from "next/navigation";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { UserContext } from "@/app/[locale]/context/UserContext";
import Link from "next/link";
import { BiWorld } from "react-icons/bi";
import { GoLock } from "react-icons/go";
import { MdOutlineRefresh } from "react-icons/md";
import { toast } from "sonner";
import { useQuery, useMutation } from "react-query";
import findPlayer from "../api/riot/findPlayer";
import { FaGlobeAmericas, FaGlobeEurope } from "react-icons/fa";
import {
  FaHeartCirclePlus,
  FaHeartCircleXmark,
  FaCheck,
  FaHeart,
} from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiLock } from "react-icons/bi";
import ShortMatch from "./riot/ShortMatch";
import WinRatioChart from "./riot/WinRatioChart";
import Select from "react-select";
import { customStylesDuo } from "@/lib/styles/championNamesList";
import followProfile from "../api/profile/followProfile";
import getMatchHistory from "../api/riot/getMatchHistory";
import { getSummonerSpell } from "@/lib/getSummonerSpell";
import claimAccount from "../api/profile/claimAccount";
import FullMatch from "./riot/FullMatch";
import { useTranslation } from "react-i18next";

const serverVisuals = (server) => {
  switch (server) {
    case "eun1":
      return { icon: <FaGlobeEurope className="text-[32px]" />, name: "EUNE" };
    case "euw1":
      return { icon: <FaGlobeEurope className="text-[32px]" />, name: "EUW" };
    case "na1":
      return { icon: <FaGlobeAmericas className="text-[32px]" />, name: "NA" };
    default:
      return {
        icon: <FaGlobeAmericas className="text-[32px]" />,
        name: "Unknown",
      };
  }
};

const masteryMapping = (mastery) => {
  if (mastery >= 10) {
    return 10;
  }

  switch (mastery) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 6:
      return 6;
    case 7:
      return 7;
    case 8:
      return 8;
    case 9:
      return 9;
    default:
      return 1;
  }
};

const queueOptions = [
  { value: "", label: "All" },
  { value: "420", label: "Ranked Solo" },
  { value: "440", label: "Ranked Flex" },
  { value: "450", label: "ARAM" },
  { value: "1700", label: "Arena" },
];

const SummonerProfile = () => {
  const { userData, setUserData, isLogged, setIsLogged } =
    useContext(UserContext);

  const [matchesShown, setMatchesShown] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [queue, setQueue] = useState("");

  const { t } = useTranslation();
  const router = useRouter();

  const [showFullMatch, setShowFullMatch] = useState(null);

  const params = useParams();
  const axios = useAxios();
  const axiosPublic = useAxiosPublic();
  const axiosInstance = isLogged ? axios : axiosPublic;

  const {
    data: playerData,
    isLoading: playerIsLoading,
    error: playerError,
    refetch: playerDataRefetch,
  } = useQuery(
    "summonerData",
    () => findPlayer(axiosInstance, params.server, params.username, params.tag),
    {
      refetchOnWindowFocus: false,
      onError: () => {
        router.push("/");
      },
    }
  );

  const {
    data: matchesData,
    isLoading: matchesIsLoading,
    error: matchesError,
    refetch: matchesRefetch,
  } = useQuery(
    ["matchesData", matchesShown, queue],
    () => getMatchHistory(axiosInstance, playerData.puuid, matchesShown, queue),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!playerData,
    }
  );

  const { mutateAsync: handleFollow } = useMutation(
    () => followProfile(axiosInstance, playerData.server, playerData.puuid),
    {
      onSuccess: (data) => {
        playerDataRefetch();
      },
      onError: (error) => {
        console.error("Error following/unfollowing:", error);
      },
    }
  );

  const { mutateAsync: handleClaimAccount } = useMutation(
    () => claimAccount(axiosInstance, playerData.server, playerData.puuid),
    {
      onSuccess: (data) => {
        playerDataRefetch();
      },
      onError: (error) => {
        console.error("Error claiming/unclaiming:", error);
      },
    }
  );

  const handleQueueFilter = async (value) => {
    console.log(value.value);
    setQueue(value.value);
  };

  const toggleFullMatch = (matchId) => {
    console.log("siema");
    setShowFullMatch(showFullMatch === matchId ? null : matchId);
  };

  if (playerIsLoading || matchesIsLoading || !playerData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (!playerIsLoading && !matchesIsLoading && playerData) {
    return (
      <div className="min-h-screen w-full bg-night flex flex-col px-[10%]">
        <div className="mt-[10%] w-full flex items-center gap-x-4">
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              "15.1.1" +
              "/img/profileicon/" +
              playerData.profileIconId +
              ".png"
            }
            height={180}
            width={180}
            className="border-[1px] border-white-smoke"
          />
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-x-4 font-bangers">
              <p className="text-[64px]">{playerData.gameName}</p>
              <p className="text-[28px]">#{playerData.tagLine}</p>
            </div>
            <div className="flex items-center gap-x-2">
              {(() => {
                const { icon, name } = serverVisuals(playerData.server); // Wywołanie funkcji z przekazaniem 'server'
                return (
                  <>
                    {icon}
                    <p className="font-dekko text-[20px]">{name}</p>
                  </>
                );
              })()}
            </div>
            {isLogged && (
              <div className="flex items-center gap-x-3 font-dekko py-5 pl-1">
                {playerData.inWatchlist === true ? (
                  <div
                    className="flex items-center gap-x-2 cursor-pointer hover:text-white-smoke duration-150 transition-all text-amber"
                    onClick={() => handleFollow()}
                  >
                    <FaHeart className="text-[24px]" />
                    <p className="text-[20px]">{t("riot:following")}</p>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-x-2 cursor-pointer hover:text-amber duration-150 transition-all"
                    onClick={() => handleFollow()}
                  >
                    <FaHeartCirclePlus className="text-[24px]" />
                    <p className="text-[20px]">{t("riot:followProfile")}</p>
                  </div>
                )}
                {playerData.myAccount ? (
                  <div
                    className="flex items-center gap-x-1 text-amber"
                    // onClick={() => handleClaimAccount()}
                  >
                    <FaCheck className="text-[24px]" />
                    <p className="text-[20px]">{t("riot:myAccount")}</p>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-x-2 cursor-pointer hover:text-amber duration-150 transition-all"
                    onClick={() => handleClaimAccount()}
                  >
                    <BiLock className="text-[24px]" />
                    <p className="text-[20px]">{t("riot:claimAccount")}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-[2%] flex justify-between w-full font-dekko">
          <div className="flex flex-col w-[40%] ">
            <div className="bg-silver bg-opacity-15 rounded-2xl py-4 px-6">
              {playerData.ranks.find(
                (rank) => rank.queueType === "RANKED_SOLO_5x5"
              ) ? (
                <div className="flex flex-col gap-y-2">
                  <p className="text-[24px]">{t("riot:rankSoloDuo")}</p>
                  <div className="flex items-center gap-x-3 w-full justify-between">
                    <div className="flex items-center gap-x-3">
                      <Image
                        src={
                          "/rank_emblems/" +
                          playerData.ranks
                            .find(
                              (rank) => rank.queueType === "RANKED_SOLO_5x5"
                            )
                            .tier.charAt(0)
                            .toUpperCase() +
                          playerData.ranks
                            .find(
                              (rank) => rank.queueType === "RANKED_SOLO_5x5"
                            )
                            .tier.slice(1)
                            .toLowerCase() +
                          ".png"
                        }
                        height={80}
                        width={80}
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-[24px]">
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_SOLO_5x5"
                            ).tier
                          }{" "}
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_SOLO_5x5"
                            ).rank
                          }
                        </p>
                        <p className="text-[20px]">
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_SOLO_5x5"
                            ).leaguePoints
                          }{" "}
                          LP
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-[24px] pl-4">
                        <span className="">
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_SOLO_5x5"
                            ).wins
                          }
                          W
                        </span>{" "}
                        -{" "}
                        {
                          playerData.ranks.find(
                            (rank) => rank.queueType === "RANKED_SOLO_5x5"
                          ).losses
                        }
                        L
                      </p>
                      <p>
                        WR:{" "}
                        {(
                          (playerData.ranks.find(
                            (rank) => rank.queueType === "RANKED_SOLO_5x5"
                          ).wins /
                            (playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_SOLO_5x5"
                            ).wins +
                              playerData.ranks.find(
                                (rank) => rank.queueType === "RANKED_SOLO_5x5"
                              ).losses)) *
                          100
                        ).toFixed(0)}{" "}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>{t("riot:noRankSoloDuo")}</p>
              )}
            </div>
            <div className="bg-silver bg-opacity-15 rounded-2xl py-4 px-6 mt-4">
              {playerData.ranks.find(
                (rank) => rank.queueType === "RANKED_FLEX_SR"
              ) ? (
                <div className="flex flex-col gap-y-2">
                  <p className="text-[24px]">{t("riot:rankFlex")}</p>
                  <div className="flex items-center gap-x-3 w-full justify-between">
                    <div className="flex items-center gap-x-3">
                      <Image
                        src={
                          "/rank_emblems/" +
                          playerData.ranks
                            .find((rank) => rank.queueType === "RANKED_FLEX_SR")
                            .tier.charAt(0)
                            .toUpperCase() +
                          playerData.ranks
                            .find((rank) => rank.queueType === "RANKED_FLEX_SR")
                            .tier.slice(1)
                            .toLowerCase() +
                          ".png"
                        }
                        height={80}
                        width={80}
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-[24px]">
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_FLEX_SR"
                            ).tier
                          }{" "}
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_FLEX_SR"
                            ).rank
                          }
                        </p>
                        <p className="text-[20px]">
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_FLEX_SR"
                            ).leaguePoints
                          }{" "}
                          LP
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center flex-col gap-y-1">
                      <p className="text-[24px] pl-4">
                        <span className="">
                          {
                            playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_FLEX_SR"
                            ).wins
                          }
                          W
                        </span>{" "}
                        -{" "}
                        {
                          playerData.ranks.find(
                            (rank) => rank.queueType === "RANKED_FLEX_SR"
                          ).losses
                        }
                        L
                      </p>
                      <p>
                        WR:{" "}
                        {(
                          (playerData.ranks.find(
                            (rank) => rank.queueType === "RANKED_FLEX_SR"
                          ).wins /
                            (playerData.ranks.find(
                              (rank) => rank.queueType === "RANKED_FLEX_SR"
                            ).wins +
                              playerData.ranks.find(
                                (rank) => rank.queueType === "RANKED_FLEX_SR"
                              ).losses)) *
                          100
                        ).toFixed(0)}{" "}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>{t("riot:noRankFlex")}</p>
              )}
            </div>
            <div className="bg-silver bg-opacity-15 rounded-2xl py-4 px-6 mt-4">
              <p className="text-[24px]">{t("riot:championMastery")}</p>
              <div className="flex gap-x-6 mt-4">
                {playerData.mastery.map((champion, key) => {
                  return (
                    <div key={key} className="flex flex-col items-center">
                      <Image
                        src={
                          "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/" +
                          champion.championName +
                          ".png"
                        }
                        height={80}
                        width={80}
                        className="rounded-full border-[1px] border-white-smoke"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-[32px]">{champion.championLevel}</p>
                        <Image
                          src={
                            "/mastery_emblems/" +
                            masteryMapping(champion.championLevel) +
                            ".webp"
                          }
                          width={64}
                          height={64}
                        />
                        <p className="text-[20px]">
                          {(champion.championPoints / 1000).toFixed(1)}k
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-[45%] flex flex-col items-center">
            <div className="flex justify-between items-end h-[150px] w-full">
              <WinRatioChart matchesData={matchesData} />
              <Select
                styles={customStylesDuo}
                options={queueOptions}
                onChange={handleQueueFilter}
                placeholder="All"
                className="w-[35%]"
                isSearchable={false}
              />
            </div>
            {matchesData.length > 0 ? (
              <div className="mt-6 flex flex-col gap-y-4 w-full">
                {matchesData.map((match, key) => (
                  <div key={key} className="flex flex-col">
                    <div
                      onClick={() => toggleFullMatch(match.matchId)}
                      className="cursor-pointer"
                    >
                      <ShortMatch match={match} />
                    </div>
                    {showFullMatch === match.matchId && (
                      <div className="mt-2">
                        <FullMatch matchId={match.matchId} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>{t("riot:noMatches")}</p>
            )}

            <button
              onClick={() => setMatchesShown(matchesShown + 10)}
              className="w-[25%] px-5 py-2 border-[1px] border-white-smoke text-[20px] rounded-3xl mt-6 hover:bg-white-smoke hover:bg-opacity-15 duration-150 transition-all"
            >
              {t("riot:showMore")}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default SummonerProfile;
