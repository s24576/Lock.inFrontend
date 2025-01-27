"use client";
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import FindPlayerForm from "./riot/FindPlayerForm";
import { useTranslation } from "react-i18next";
import { FaGooglePlay, FaComment, FaBookOpen } from "react-icons/fa";
import {
  IoDesktopOutline,
  IoGameControllerOutline,
  IoPeople,
} from "react-icons/io5";
import { RITeamFill, RISwordFill } from "@icongo/ri";

const Mainpage = () => {
  const { t } = useTranslation();

  const tiles = [
    {
      title: t("mainpage:bento1title"),
      description: t("mainpage:bento1"),
      icon: <IoGameControllerOutline className="text-[64px]" />,
    },

    {
      title: t("mainpage:bento2title"),
      description: t("mainpage:bento2"),
      icon: <RITeamFill fill="#F5F5F5" className="text-[64px] " />,
    },

    {
      title: t("mainpage:bento3title"),
      description: t("mainpage:bento3"),
      icon: <FaComment className="text-[64px]" />,
    },

    {
      title: t("mainpage:bento4title"),
      description: t("mainpage:bento4"),
      icon: <RISwordFill fill="#F5F5F5" className="text-[64px] " />,
    },

    {
      title: t("mainpage:bento5title"),
      description: t("mainpage:bento5"),
      icon: <FaBookOpen className="text-[64px]" />,
    },

    {
      title: t("mainpage:bento6title"),
      description: t("mainpage:bento6"),
      icon: <IoPeople className="text-[64px]" />,
    },
  ];

  return (
    <div className="flex flex-col font-bangers">
      <div className="h-screen">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url('/mainpage-photo1.webp')`,
            opacity: 0.3,
          }}
        ></div>

        <div className="top-[25%] flex flex-col items-center  gap-y-10 z-10 relative h-full">
          <div className="flex items-center gap-x-8">
            <p className="text-[112px]">Lock.in</p>
            <div className="flex flex-col items-center">
              <p className="text-[32px]">{t("mainpage:header")}</p>
              <p className="text-[32px]">{t("mainpage:header2")}</p>
            </div>
          </div>

          <FindPlayerForm></FindPlayerForm>
        </div>
      </div>

      <div className="h-screen bg-gradient-to-b from-[#1A0E05] to-night to-80% font-dekko flex items-center justify-center px-[8%] gap-x-[8%]">
        <div className="flex flex-col items-center justify-center gap-y-12 w-[35%] ">
          <p className="text-[64px] text-center">{t("mainpage:header3")}</p>
          <div className="flex items-center gap-x-12">
            <Link
              href="/courses"
              className="flex items-center gap-x-2 hover:text-amber transition-colors duration-100"
            >
              <FaGooglePlay className="text-[28px]"></FaGooglePlay>
              <p className="text-[24px]">Lock.in Mobile</p>
            </Link>

            <Link
              href="/courses"
              className="flex items-center gap-x-2 hover:text-amber transition-colors duration-100"
            >
              <IoDesktopOutline className="text-[28px]"></IoDesktopOutline>
              <p className="text-[24px]">Lock.in Desktop</p>
            </Link>
          </div>
        </div>
        <div className="w-[65%] grid grid-cols-3 gap-8">
          {tiles.map((tile, key) => {
            return (
              <div
                key={key}
                className="flex items-center justify-center gap-x-6 px-3 h-[18vh] border-2 border-white-smoke rounded-xl cursor-pointer hover:bg-white-smoke hover:bg-opacity-5 transition-colors duration-100"
              >
                {tile.icon}
                <div className="flex flex-col gap-y-2 w-[60%] text-center">
                  <p>{tile.title}</p>
                  <p className="text-[14px]">{tile.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
