import React from "react";
import Image from "next/image";
import Link from "next/link";

//narazie static
const ShortMatch = ({ match }) => {
  return (
    <Link
      href="/match/EUN1_3713685209"
      className="h-[80px] w-[110%] border-2 border-amber rounded-2xl flex items-center px-3 hover:bg-white-smoke hover:bg-opacity-5 transition-colors duration-100"
    >
      <Image
        src={
          "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/" +
          "MissFortune" +
          ".png"
        }
        height={55}
        width={55}
        className="rounded-full border-[1px] border-amber"
        alt="test"
      />
      <div className="flex flex-col gap-y-1 ml-3">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
            "SummonerFlash" +
            ".png"
          }
          height={24}
          width={24}
          alt="test"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/spell/" +
            "SummonerBarrier" +
            ".png"
          }
          height={24}
          width={24}
          alt="test"
        />
      </div>
      <div className="flex flex-col gap-y-1 ml-2 items-center">
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png`}
          height={24}
          width={24}
          alt="test"
        />
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png`}
          height={20}
          width={20}
          alt="test"
        />
      </div>
      <div className="flex flex-col justify-center ml-3">
        <p className="text-[24px]">11/7/3</p>
        <p className="text-[16px]">KDA: 2.00:1</p>
      </div>
      <div className="flex flex-col justify-center ml-4">
        <p className="text-[16px]">CS: 184 (6)</p>
        <p className="text-[16px]">KP:37%</p>
        <p className="text-[16px] text-amber">TRIPLE KILL</p>
      </div>
      <div className="grid grid-cols-3 gap-y-2 gap-x-1 ml-4">
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/1031.png"
          }
          height={28}
          width={28}
          className="border-[1px] border-white-smoke"
          alt="test"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/3006.png"
          }
          height={28}
          width={28}
          className="border-[1px] border-white-smoke"
          alt="test"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/3124.png"
          }
          height={28}
          width={28}
          className="border-[1px] border-white-smoke"
          alt="test"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/3302.png"
          }
          height={28}
          width={28}
          className="border-[1px] border-white-smoke"
          alt="test"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/3153.png"
          }
          height={28}
          width={28}
          className="border-[1px] border-white-smoke"
          alt="test"
        />
        <Image
          src={
            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/1011.png"
          }
          height={28}
          width={28}
          className="border-[1px] border-white-smoke"
          alt="test"
        />
      </div>
      <Image
        src={
          "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/3363.png"
        }
        height={28}
        width={28}
        className="border-[1px] border-white-smoke ml-1"
        alt="test"
      />
      <div className="flex flex-col justify-center items-center ml-4 text-[16px]">
        <p>Ranked Flex</p>
        <p>2 days ago</p>
        <div className="flex items-center gap-x-1">
          <p className="text-amber">VICTORY</p>
          <p>30:39</p>
        </div>
      </div>
    </Link>
  );
};

export default ShortMatch;
