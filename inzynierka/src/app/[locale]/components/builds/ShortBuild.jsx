import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useQuery } from "react-query";
import getRunes from "../../api/ddragon/getRunes";
import { BiLike, BiDislike } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

const ShortBuild = ({ build, shortProfilesData }) => {
  //wyswietlanie czasu od dodania builda
  dayjs.extend(relativeTime);

  const image = shortProfilesData?.[build.username]?.image;

  const {
    data: runesData,
    error: runesError,
    isLoading: runesIsLoading,
  } = useQuery("runesData", () => getRunes(), {
    refetchOnWindowFocus: false,
  });

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  return (
    <Link
      href={"/builds/" + build._id}
      className="flex items-center border-[1px] border-amber px-3 py-3 rounded-xl gap-x-4 w-full hover:bg-silver-hover transition-colors duration-50"
    >
      <p className="w-[10%] text-[18px] text-center">
        {dayjs(build.timestamp * 1000).fromNow()}
      </p>
      <div className="relative">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            "14.11.1" +
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
          <Image
            src={
              "https://ddragon.leagueoflegends.com/cdn/" +
              "14.11.1" +
              "/img/champion/" +
              build.championId +
              ".png"
            }
            width={20} // 1/4 wielkości oryginalnego obrazka
            height={20} // 1/4 wielkości oryginalnego obrazka
            alt={build.championName}
            className="absolute bottom-0 left-[30px] rounded-full border-[1px] border-white-smoke"
          />
        )}
      </div>
      <p className="w-[18%] truncate text-[24px] text-amber px-1">
        {build.title}
      </p>
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
            if (rune.id.toString() === build.runes.keyStone1Id.toString())
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
      <div className="flex items-center gap-x-1 pl-10 pr-4">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
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
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
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
      <div className="flex items-center gap-x-1">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/" +
            "14.11.1" +
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
            "14.11.1" +
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
            "14.11.1" +
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
            "14.11.1" +
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
            "14.11.1" +
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
            "14.11.1" +
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
    </Link>
  );
};

export default ShortBuild;
