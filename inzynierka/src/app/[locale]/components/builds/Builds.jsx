"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";

const Builds = () => {
  const [builds, setBuilds] = useState([]);
  const [championNames, setChampionNames] = useState([]);

  const pathname = usePathname();

  useEffect(() => {
    const langRegex = /^\/([a-z]{2})\//;
    const langMatch = pathname.match(langRegex);
    const language = langMatch ? langMatch[1] : "en";
    console.log("language, ", language);

    const fetchBuild = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/build/getBuilds?page=0&size=15&lang=en",
          {}
        );
        console.log(response.data);
        setBuilds(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchChampionNames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/ddragon/getChampionNames"
        );

        console.log(response.data);
        setChampionNames(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBuild();
    fetchChampionNames();
  }, []);

  return (
    <div className="h-screen text-white flex flex-col items-center">
      <div className="mt-[115px] flex justify-center gap-x-2 h-8 items-center">
        <p className="">Builds</p>
        <Link
          href="/builds/create"
          className=" px-3 py-1 bg-blue-400 text-white border-2 border-white"
        >
          Create Build
        </Link>
      </div>
      <input
        type="text"
        className="px-3 py-1 mt-3"
        placeholder="Search by ? "
      />
      {/* by champion, by tags?, by author */}
      <div className="flex items-center mt-3 gap-x-3">
        <p>Sort by: </p>
        <select className="text-black">
          <option value="">Aatrox</option>
          <option value="">Ahri</option>
          <option value="">Anivia</option>
        </select>
        <input type="text" className="px-3 py-1" placeholder="tags" />
        <input type="text" className="px-3 py-1" placeholder="Author name" />
        <select className="text-black">
          <option value="">12</option>
          <option value="">24</option>
          <option value="">36</option>
        </select>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(builds.content) && builds.content.length > 0 ? (
          builds.content.map((build, index) => {
            return (
              <Link
                href={"/builds/" + build._id}
                key={index}
                className="flex flex-col justify-center items-center border-2 border-white p-5 cursor-pointer 
                hover:bg-[#1a1a1a]"
              >
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/" +
                    "14.11.1" +
                    "/img/champion/" +
                    //tutaj
                    build.championId +
                    ".png"
                  }
                  width={50}
                  height={50}
                  alt={build.championName}
                />
                <p>{build.champion}</p>
                <div className="flex">
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                      build.item1 +
                      ".png"
                    }
                    height={50}
                    width={50}
                    alt={build.item1}
                  />

                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                      build.item2 +
                      ".png"
                    }
                    height={50}
                    width={50}
                    alt={build.item2}
                  />

                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                      build.item3 +
                      ".png"
                    }
                    height={50}
                    width={50}
                    alt={build.item3}
                  />

                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                      build.item4 +
                      ".png"
                    }
                    height={50}
                    width={50}
                    alt={build.item4}
                  />

                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                      build.item5 +
                      ".png"
                    }
                    height={50}
                    width={50}
                    alt={build.item5}
                  />

                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                      build.item6 +
                      ".png"
                    }
                    height={50}
                    width={50}
                    alt={build.item6}
                  />
                </div>
              </Link>
            );
          })
        ) : (
          <p>No builds</p>
        )}
      </div>
    </div>
  );
};

export default Builds;
