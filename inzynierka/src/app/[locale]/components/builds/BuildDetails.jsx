"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAxios from "../../hooks/useAxios";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { IoMdUnlock, IoMdLock } from "react-icons/io";
import { MdDelete, MdReply, MdNavigateNext } from "react-icons/md";
import { useQuery, useMutation } from "react-query";
import getBuildById from "../../api/builds/getBuildById";
import getRunes from "../../api/ddragon/getRunes";
import saveBuild from "../../api/builds/saveBuild";
import deleteBuild from "../../api/builds/deleteBuild";
import getShortProfile from "../../api/profile/getShortProfile";
import react from "../../api/comments/react";
import CommentsSection from "../comments/CommentsSection";
import LeaguePosition from "../other/LeaguePosition";
import {
  BiLike,
  BiDislike,
  BiSolidLock,
  BiSolidLockOpen,
} from "react-icons/bi";
import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsShad/ui/tooltip";
import { useTranslation } from "react-i18next";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const BuildDetails = () => {
  const { userData, isLogged } = useContext(UserContext);
  const { version } = useContext(SearchContext);

  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const axios = useAxios();
  const axiosPublic = useAxiosPublic();
  const axiosInstance = isLogged ? axios : axiosPublic;
  const { t } = useTranslation();

  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const {
    refetch: refetchBuild,
    data: buildData,
    error: buildError,
    isLoading: buildIsLoading,
  } = useQuery("buildData", () => getBuildById(axiosInstance, params.buildId), {
    refetchOnWindowFocus: false,
    onError: () => {
      router.push("/builds");
    },
  });

  const {
    refetch: authorProfileRefetch,
    data: authorProfileData,
    error: authorProfileError,
    isLoading: authorProfileIsLoading,
  } = useQuery(
    "authorProfileData",
    () => getShortProfile(axiosInstance, buildData.username),
    {
      enabled: !!buildData,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: runesData,
    error: runesError,
    isLoading: runesIsLoading,
  } = useQuery("runesData", () => getRunes(), {
    refetchOnWindowFocus: false,
  });

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const { mutateAsync: handleDeleteBuild } = useMutation(
    (buildId) => deleteBuild(axiosInstance, buildData._id),
    {
      onSuccess: () => {
        router.push("/builds");
      },
      onError: (error) => {
        console.error("Error creating reaction:", error);
      },
    }
  );

  const { mutateAsync: handleSaveBuild } = useMutation(
    () => saveBuild(axiosInstance, buildData._id),
    {
      onSuccess: () => {
        refetchBuild();
      },
      onError: (error) => {
        console.error("Error saving build:", error);
      },
    }
  );

  const { mutateAsync: leaveReaction } = useMutation(
    (data) => react(axiosInstance, data.objectId, data.value),
    {
      onSuccess: () => {
        refetchBuild();
      },
      onError: (error) => {
        console.error("Error creating reaction:", error);
      },
    }
  );

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  if (
    buildIsLoading ||
    !buildData ||
    runesIsLoading ||
    !runesData ||
    authorProfileIsLoading ||
    !authorProfileData
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (!buildIsLoading && buildData && runesData && authorProfileData) {
    return (
      <div className="min-h-screen w-full">
        <div
          className="absolute inset-0 bg-cover bg-fixed"
          style={{
            backgroundImage:
              buildData && buildData.championId
                ? `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${buildData.championId}_0.jpg')`
                : "none",
            backgroundColor:
              buildData && buildData.championId ? "transparent" : "#131313",
            opacity: "0.4",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
          }}
        ></div>
        <div className="flex w-full px-[10%] justify-between items-strech">
          <div className="z-20 mt-[14%] w-[60%] flex flex-col font-dekko ">
            <div className="w-full bg-night bg-opacity-70 rounded-xl py-4 flex items-center justify-between">
              <div className="flex items-center px-4">
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/" +
                    version +
                    "/img/champion/" +
                    buildData?.championId +
                    ".png"
                  }
                  width={100}
                  height={100}
                  alt={buildData?.championName}
                  className="rounded-full border-[1px] border-white-smoke mx-3"
                />
                <div className="flex flex-col items-start gap-y-2">
                  <div className="flex items-center">
                    {buildData?.position ? (
                      <LeaguePosition
                        position={buildData.position}
                        height={48}
                      />
                    ) : (
                      <Image
                        src={
                          "https://ddragon.leagueoflegends.com/cdn/" +
                          version +
                          "/img/champion/" +
                          buildData?.championId +
                          ".png"
                        }
                        width={48}
                        height={48}
                        alt={buildData?.championName}
                        className=" mx-2"
                      />
                    )}

                    <p className="text-[28px]">{buildData?.title}</p>
                    {isLogged && (
                      <div
                        className="z-40 ml-3 text-[28px] cursor-pointer hover:text-amber duration-100 transition-colors"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => handleSaveBuild()}
                      >
                        {isHovered ? (
                          buildData?.saved ? (
                            <BiSolidLockOpen />
                          ) : (
                            <BiSolidLock className="text-amber" />
                          )
                        ) : buildData?.saved ? (
                          <BiSolidLock className="text-amber" />
                        ) : (
                          <BiSolidLockOpen />
                        )}
                      </div>
                    )}
                    {isLogged && userData?.username === buildData?.username && (
                      <AiOutlineDelete
                        onClick={() => handleDeleteBuild()}
                        className="z-40 ml-1 text-[28px] cursor-pointer hover:text-amber duration-100 transition-colors"
                      ></AiOutlineDelete>
                    )}
                  </div>
                  <div className="flex items-center gap-x-2">
                    {authorProfileData?.image ? (
                      <img
                        src={getImageSrc(authorProfileData.image)}
                        className="ml-2 mt-1 w-[40px] h-[40px] object-cover border-2 border-white-smoke rounded-full align-middle"
                      />
                    ) : (
                      <div className="h-[48px] w-[48px] border-2 border-white-smoke rounded-full flex items-center justify-center">
                        <FaUser className="text-silver text-[24px]"></FaUser>
                      </div>
                    )}
                    <Link
                      href={"/profile/" + authorProfileData?.username}
                      className="text-[20px] hover:underline duration-100 transition-all"
                    >
                      {authorProfileData?.username}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-x-4 pr-8">
                <div
                  className={
                    buildData?.reaction === true &&
                    buildData?.canReact === false
                      ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                      : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                  }
                >
                  <BiLike
                    onClick={() => {
                      leaveReaction({
                        objectId: buildData?._id,
                        value: true,
                      });
                    }}
                    className="cursor-pointer"
                  ></BiLike>
                  <p className="text-[20px]">{buildData?.likesCount}</p>
                </div>
                <div
                  className={
                    buildData?.reaction === false &&
                    buildData?.canReact === false
                      ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                      : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                  }
                >
                  <BiDislike
                    onClick={() => {
                      leaveReaction({
                        objectId: buildData?._id,
                        value: false,
                      });
                    }}
                    className="cursor-pointer"
                  ></BiDislike>
                  <p className="text-[20px]">{buildData?.dislikesCount}</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-night bg-opacity-70 rounded-xl py-6 flex items-center gap-x-4 mt-[6%] px-7">
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/item/" +
                  buildData?.item1 +
                  ".png"
                }
                width={64}
                height={64}
                alt={buildData?.item1}
                className="border-[1px] border-white-smoke hover:opacity-80 duration-100 transition-opacity"
              />
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/item/" +
                  buildData?.item2 +
                  ".png"
                }
                width={64}
                height={64}
                alt={buildData?.item2}
                className="border-[1px] border-white-smoke hover:opacity-80 duration-100 transition-opacity"
              />
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/item/" +
                  buildData?.item3 +
                  ".png"
                }
                width={64}
                height={64}
                alt={buildData?.item3}
                className="border-[1px] border-white-smoke hover:opacity-80 duration-100 transition-opacity"
              />
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/item/" +
                  buildData?.item4 +
                  ".png"
                }
                width={64}
                height={64}
                alt={buildData?.item4}
                className="border-[1px] border-white-smoke hover:opacity-80 duration-100 transition-opacity"
              />
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/item/" +
                  buildData?.item5 +
                  ".png"
                }
                width={64}
                height={64}
                alt={buildData?.item5}
                className="border-[1px] border-white-smoke hover:opacity-80 duration-100 transition-opacity"
              />
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/item/" +
                  buildData?.item6 +
                  ".png"
                }
                width={64}
                height={64}
                alt={buildData?.item6}
                className="border-[1px] border-white-smoke hover:opacity-80 duration-100 transition-opacity"
              />
            </div>
            <div className="w-full flex justify-between mt-[4%]">
              <TooltipProvider>
                <div className="w-[60%] bg-night bg-opacity-70  rounded-xl py-4 px-6 flex flex-col gap-y-5">
                  <div className="flex items-center gap-x-6">
                    {runesData &&
                      runesData.map((runeTree, runeTreeKey) => {
                        return runeTree.slots.map((slot, slotKey) => {
                          return slot.runes.map((rune, runeKey) => {
                            if (
                              buildData?.runes.runes1.includes(
                                rune.id.toString()
                              )
                            ) {
                              return (
                                <Tooltip key={runeKey}>
                                  <TooltipTrigger>
                                    <Image
                                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                      alt={rune.name}
                                      width={64}
                                      height={64}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[350px]">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: rune.longDesc,
                                      }}
                                    />
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            return null;
                          });
                        });
                      })}
                  </div>
                  <div className="flex items-center gap-x-6">
                    {runesData &&
                      runesData.map((runeTree, runeTreeKey) => {
                        return runeTree.slots.map((slot, slotKey) => {
                          return slot.runes.map((rune, runeKey) => {
                            if (
                              buildData?.runes.runes2.includes(
                                rune.id.toString()
                              )
                            ) {
                              return (
                                <Tooltip key={runeKey}>
                                  <TooltipTrigger>
                                    <Image
                                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                      alt={rune.name}
                                      width={64}
                                      height={64}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[350px]">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: rune.longDesc,
                                      }}
                                    />
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            return null;
                          });
                        });
                      })}
                    {buildData?.runes.statShards.map((shard, key) => {
                      return (
                        <Image
                          key={key}
                          src={"/rune-shards/" + shard + ".webp"}
                          alt={shard}
                          width={32}
                          height={32}
                        />
                      );
                    })}
                  </div>
                </div>
              </TooltipProvider>
              <div className="w-[10%] flex items-center justify-center">
                <FaPlus className="text-[36px]"></FaPlus>
              </div>
              <div className="w-[30%] bg-night bg-opacity-70  rounded-xl py-4 px-6 flex items-center justify-center gap-x-3">
                {buildData?.summoner1Name && (
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/" +
                      version +
                      "/img/spell/" +
                      "Summoner" +
                      buildData.summoner1Name +
                      ".png"
                    }
                    width={64}
                    height={64}
                    alt={buildData.summoner1Name}
                    className=""
                  />
                )}
                {buildData?.summoner2Name && (
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/" +
                      version +
                      "/img/spell/" +
                      "Summoner" +
                      buildData.summoner2Name +
                      ".png"
                    }
                    width={64}
                    height={64}
                    alt="summoner_spell2"
                    className=""
                  />
                )}
              </div>
            </div>
          </div>
          <div className="z-20 mt-[14%] w-[30%] bg-night bg-opacity-60 p-5 font-dekko rounded-xl ">
            <p className="text-[28px]">{t("builds:description")}</p>
            <p className="mt-3">{buildData?.description}</p>
          </div>
        </div>
        <div className="absolute top-[100vh] w-full bg-night">
          {buildData && <CommentsSection id={buildData._id} />}
        </div>
      </div>
    );
  }
};

export default BuildDetails;
