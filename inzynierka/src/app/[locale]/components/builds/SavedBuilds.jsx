"use client";
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import Link from "next/link";
import Image from "next/image";

export const SavedBuilds = () => {
  const [builds, setBuilds] = useState([]);

  const api = useAxios();

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const response = await api.get(`/build/getSavedBuilds`);
        console.log(response.data);
        setBuilds(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBuilds();
  }, []);

  return (
    <div className="min-h-screen w-full pt-[70px] flex flex-col items-center">
      <h1 className="mt-[100px] text-[40px]">Saved builds</h1>

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
                <button className="mt-3 text-red-600 px-3 py-2 border-[1px] border-white hover:bg-red-500 hover:text-white">
                  Delete build
                </button>
              </Link>
            );
          })
        ) : (
          <p className="">No builds</p>
        )}
      </div>
    </div>
  );
};
