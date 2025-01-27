import React, { useState, useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useQuery, useMutation } from "react-query";
import useAxios from "../../hooks/useAxios";
import getRunes from "../../api/ddragon/getRunes";
import deleteBuild from "../../api/builds/deleteBuild";
import saveBuild from "../../api/builds/saveBuild";
import LeaguePosition from "../other/LeaguePosition";
import {
  BiLike,
  BiDislike,
  BiSolidLock,
  BiSolidLockOpen,
} from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import Link from "next/link";

const ShortBuild = ({
  build,
  shortProfilesData,
  delete: deleteFlag,
  saved: savedFlag,
}) => {
  //wyswietlanie czasu od dodania builda
  dayjs.extend(relativeTime);

  const image = shortProfilesData?.[build.username]?.image;

  const { version } = useContext(SearchContext);

  const axiosInstance = useAxios();

  const [isHovered, setIsHovered] = useState(false);

  const {
    data: runesData,
    error: runesError,
    isLoading: runesIsLoading,
  } = useQuery("runesData", () => getRunes(), {
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: handleDeleteBuild } = useMutation(
    () => deleteBuild(axiosInstance, build._id),
    {
      onSuccess: () => {
        // Przeładowanie strony po udanym usunięciu buildu
        window.location.reload();
      },
      onError: (error) => {
        console.error("Error deleting build:", error);
      },
    }
  );

  const { mutateAsync: handleSaveBuild } = useMutation(
    () => saveBuild(axiosInstance, build._id),
    {
      onSuccess: () => {
        // Przeładowanie strony po udanym usunięciu buildu
        window.location.reload();
      },
      onError: (error) => {
        console.error("Error saving build:", error);
      },
    }
  );

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  return (
    <div className="flex items-center border-[1px] border-amber px-3 py-3 rounded-xl gap-x-4 w-full hover:bg-silver-hover transition-colors duration-50">
      <p className="w-[10%] text-[18px] text-center">
        {dayjs(build.timestamp * 1000).fromNow()}
      </p>
      <div className="relative">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/champion/" +
            build.championId +
            ".png"
          }
          width={40}
          height={40}
          alt={build.championName}
          className="rounded-full border-[1px] border-white-smoke"
        />
        {build.position !== null && (
          <div className="absolute bottom-0 left-[32px] rounded-full border-[1px] border-white-smoke">
            <LeaguePosition
              position={build.position}
              height={20}
              fillColor={"#f5b800"}
            />
          </div>
        )}
      </div>
      <Link
        href={"/builds/" + build._id}
        className="w-[18%] truncate text-[24px] text-amber px-1 ml-2"
      >
        {build.title}
      </Link>
      <div className="relative">
        {runesData &&
          runesData.map((runeData, runeDataIndex) => {
            return runeData.slots.map((slot, slotIndex) => {
              return slot.runes.map((rune, runeIndex) => {
                if (
                  rune.id.toString() === build.runes.runes1?.[0]?.toString()
                ) {
                  return (
                    <Image
                      key={`${runeDataIndex}-${slotIndex}-${runeIndex}`} // Użycie unikalnego klucza
                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                      alt={"test"}
                      width={40}
                      height={40}
                    />
                  );
                }
                return null; // Zwróć null, gdy warunek nie jest spełniony
              });
            });
          })}
        {runesData &&
          runesData.map((rune, key) => {
            if (rune.id.toString() === build.runes.keyStone2Id.toString())
              return (
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                  alt={"test"}
                  width={20}
                  height={20}
                  key={key}
                  className="absolute bottom-0 left-[30px] rounded-full"
                />
              );
          })}
      </div>
      {build.summoner1Name && build.summoner2Name ? (
        <div className="flex items-center gap-x-1 pl-10 pr-4">
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/spell/" +
              "Summoner" +
              build.summoner1Name +
              ".png"
            }
            width={32}
            height={32}
            alt="summoner_spell2"
            className="border-[1px] border-white-smoke"
          />
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/spell/" +
              "Summoner" +
              build.summoner2Name +
              ".png"
            }
            width={32}
            height={32}
            alt="summoner_spell2"
            className="border-[1px] border-white-smoke"
          />
        </div>
      ) : (
        <div className="flex items-center gap-x-1 pl-10 pr-4">
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/spell/" +
              // participant.summoner2Name +
              "SummonerFlash" +
              ".png"
            }
            width={32}
            height={32}
            alt="summoner_spell2"
            className="border-[1px] border-white-smoke"
          />
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/spell/" +
              // participant.summoner2Name +
              "SummonerBarrier" +
              ".png"
            }
            width={32}
            height={32}
            alt="summoner_spell2"
            className="border-[1px] border-white-smoke"
          />
        </div>
      )}

      <div className="flex items-center gap-x-1">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/item/" +
            build.item1 +
            ".png"
          }
          width={32}
          height={32}
          alt={build.item1}
          className="border-[1px] border-white-smoke"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/item/" +
            build.item2 +
            ".png"
          }
          width={32}
          height={32}
          alt={build.item2}
          className="border-[1px] border-white-smoke"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/item/" +
            build.item3 +
            ".png"
          }
          width={32}
          height={32}
          alt={build.item3}
          className="border-[1px] border-white-smoke"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/item/" +
            build.item4 +
            ".png"
          }
          width={32}
          height={32}
          alt={build.item4}
          className="border-[1px] border-white-smoke"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/item/" +
            build.item5 +
            ".png"
          }
          width={32}
          height={32}
          alt={build.item5}
          className="border-[1px] border-white-smoke"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            version +
            "/img/item/" +
            build.item6 +
            ".png"
          }
          width={32}
          height={32}
          alt={build.item6}
          className="border-[1px] border-white-smoke"
        />
      </div>
      <div className="pl-8 flex items-center gap-x-4 w-[12%]">
        <div className="flex items-center gap-x-1">
          <BiLike className="text-[28px]"></BiLike>
          <p className="text-[20px]">{build.likesCount}</p>
        </div>
        <div className="flex items-center gap-x-1">
          <BiDislike className="text-[28px]"></BiDislike>
          <p className="text-[20px]">{build.dislikesCount}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-3 z-40">
        {image ? (
          <img
            src={getImageSrc(image)}
            className="w-[48px] h-[48px] object-cover border-2 border-white-smoke rounded-full"
          ></img>
        ) : (
          <div className="h-[48px] w-[48px] border-2 border-white-smoke rounded-full flex items-center justify-center">
            <FaUser className="text-silver text-[24px]"></FaUser>
          </div>
        )}
        <Link
          href={"/profile/" + build.username}
          className="text-[24px] hover:underline duration-150 transition-all"
        >
          {build.username}
        </Link>
      </div>
      {deleteFlag && (
        <AiOutlineDelete
          onClick={() => handleDeleteBuild()}
          className="z-40 ml-3 text-[28px] cursor-pointer hover:text-amber duration-100 transition-colors"
        ></AiOutlineDelete>
      )}
      {savedFlag && (
        <div
          className="z-40 ml-3 text-[28px] cursor-pointer hover:text-amber duration-100 transition-colors"
          onMouseEnter={() => setIsHovered(true)} // Zmieniamy stan na true, gdy najedziesz
          onMouseLeave={() => setIsHovered(false)} // Przy wyjściu ustawiamy stan na false
          onClick={() => handleSaveBuild()}
        >
          {isHovered || !build.saved ? (
            // Wyświetlamy otwartą klodkę, gdy hover lub build.saved jest false
            <BiSolidLockOpen />
          ) : (
            // Wyświetlamy zamkniętą klodkę, gdy build.saved jest true
            <BiSolidLock />
          )}
        </div>
      )}
    </div>
  );
};

export default ShortBuild;
