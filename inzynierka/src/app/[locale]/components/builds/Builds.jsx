"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "react-query";
import Select from "react-select";
import getBuilds from "../../api/ddragon/getBuilds";
import getChampionNames from "../../api/ddragon/getChampionNames";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { customStyles } from "@/lib/styles/championNamesList";

const Builds = () => {
  const [filterParams, setFilterParams] = useState({
    page: 0,
    author: "",
    championId: "",
  });

  //potrzebne do selecta z championami
  const [championOptions, setChampionOptions] = useState([]);

  const axiosInstance = useAxiosPublic();

  const {
    refetch: refetchBuilds,
    data: buildsData,
    error: buildsError,
    isLoading: buildsIsLoading,
  } = useQuery(
    "buildsData",
    () =>
      getBuilds(
        axiosInstance,
        filterParams.page,
        filterParams.author,
        filterParams.championId
      ),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: championNamesData,
    error: championNamesError,
    isLoading: championNamesIsLoading,
  } = useQuery("championNamesData", () => getChampionNames(axiosInstance), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const options = Object.entries(data).map(
        ([championKey, championValue]) => ({
          value: championKey,
          label: (
            <div className="flex items-center">
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/14.13.1/img/champion/${championKey}.png`}
                alt={championValue}
                width={20}
                height={20}
              />
              <span className="ml-2">{championValue}</span>
            </div>
          ),
        })
      );
      setChampionOptions(options);
    },
  });

  const handleFilter = async () => {
    await refetchBuilds();
  };

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
      <div className="flex items-center mt-3 gap-x-3">
        <p>Sort by: </p>
        <Select
          styles={customStyles}
          options={championOptions}
          onChange={(selectedOption) =>
            setFilterParams((prev) => ({
              ...prev,
              championId: selectedOption.value,
            }))
          }
          className="w-40"
        />
        <input
          type="text"
          className="px-3 py-1"
          placeholder="Author name"
          value={filterParams.author}
          onChange={(e) =>
            setFilterParams((prev) => ({ ...prev, author: e.target.value }))
          }
        />

        <button onClick={() => handleFilter()}>Filter</button>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(buildsData?.content) && buildsData.content.length > 0 ? (
          buildsData.content.map((build, index) => {
            return (
              <Link
                href={"/builds/" + build._id}
                key={index}
                className="flex flex-col justify-center items-center border-2 border-white p-5 cursor-pointer 
                hover:bg-[#1a1a1a]"
              >
                <h1>{build.username}</h1>
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
                <div className="flex items-center justify-center gap-x-3">
                  <p>Likes: {build.likesCount}</p>
                  <p>Disikes: {build.dislikesCount}</p>
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
