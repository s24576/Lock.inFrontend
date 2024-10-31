import React, { useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import getMyRiotProfiles from "../../api/riot/getMyRiotProfiles";
import getDuos from "../../api/duo/getDuos";
import getRiotShortProfiles from "../../api/riot/getRiotShortProfiles";
import answerDuo from "../../api/duo/answerDuo";
import { useQuery, useMutation } from "react-query";
import useAxios from "../../hooks/useAxios";
import Image from "next/image";
import { SearchContext } from "../../context/SearchContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import DuoSettings from "./DuoSettings";
import DuoCreation from "./DuoCreation";

const Duo = () => {
  const api = useAxios();

  const pathname = usePathname();
  const router = useRouter();

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const { version } = useContext(SearchContext);

  const {
    data: riotProfiles,
    error,
    isLoading,
  } = useQuery("myRiotProfiles", () => getMyRiotProfiles(api), {
    refetchOnWindowFocus: false,
  });

  const {
    data: duos,
    error: duosError,
    isLoading: duosLoading,
  } = useQuery("duos", () => getDuos(language), {
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: answerDuoMutation } = useMutation(
    ({ puuid, duoId }) => answerDuo(api, puuid, duoId),
    {
      onSuccess: () => {
        console.log("Duo answered successfully");
      },
      onError: () => {
        console.error("Error answering duo");
      },
    }
  );

  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="pt-[100px] h-screen w-full flex flex-col items-center text-white">
      <div className="relative w-full">
        <p className="absolute left-1/2 transform -translate-x-1/2">
          Duo ogłoszenie
        </p>
        <div className="absolute right-4 flex gap-x-3">
          <DuoCreation />
          <DuoSettings riotProfiles={riotProfiles} />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-5 gap-4 w-[80%]">
        {duos &&
          Array.isArray(duos.content) &&
          duos.content.length > 0 &&
          duos.content.map((duo, index) => {
            return (
              <div key={index} className="text-white mt-6">
                <div
                  className="flex gap-x-3 items-center hover:bg-[#1a1a1a] cursor-pointer rounded-2xl"
                  key={index}
                  onClick={() => {
                    router.push(
                      `/summoner/${profile.server}/${profile.tagLine}/${profile.gameName}`
                    );
                  }}
                >
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/" +
                      version +
                      "/img/profileicon/" +
                      duo.profile.profileIconId +
                      ".png"
                    }
                    width={50}
                    height={50}
                    alt="summonerIcon"
                    className="rounded-full border-2 border-white"
                  />
                  <p>{duo.profile.gameName}</p>
                  <p>{duo.profile.summonerLevel} lvl</p>
                </div>

                <p>{duo.positions}</p>
                <p>
                  {duo.minRank} - {duo.maxRank}
                </p>
                <p>{duo.languages}</p>
                <p>{duo.championIds}</p>
                {duo.saved ? (
                  <FaHeart className="text-[36px]"></FaHeart>
                ) : (
                  <FaRegHeart
                    className="text-[36px]"
                    onClick={() => {
                      console.log("dodawanie duo");
                      answerDuoMutation({
                        puuid: riotProfiles[0].puuid,
                        duoId: duo._id,
                      });
                    }}
                  ></FaRegHeart>
                )}
                <IoIosMore
                  className="text-[36px]"
                  onClick={() => {
                    router.push(`/duo/${duo._id}`);
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Duo;
