"use client";

import React, { useState, useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import Image from "next/image";
import { useQuery } from "react-query";
import Select from "react-select";
import getBuilds from "../../api/builds/getBuilds";
import getShortProfiles from "../../api/profile/getShortProfiles";
import getChampionNames from "../../api/ddragon/getChampionNames";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { customStyles } from "@/lib/styles/championNamesList";
import { BiSolidLock } from "react-icons/bi";
import ShortBuild from "./ShortBuild";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Builds = () => {
  const [filterParams, setFilterParams] = useState({
    page: 0,
    author: "",
    championId: "",
  });

  const { version } = useContext(SearchContext);

  //potrzebne do selecta z championami
  const [championOptions, setChampionOptions] = useState([]);

  //potrzebne do pobrania profili
  const [usernamesToFetch, setUsernamesToFetch] = useState([]);

  const axiosInstance = useAxiosPublic();

  const { t } = useTranslation();

  const {
    refetch: refetchBuilds,
    data: buildsData,
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
      onSuccess: (data) => {
        const usernames = data.content.map((build) => build.username);
        setUsernamesToFetch(usernames);
      },
    }
  );

  const { data: shortProfilesData, isLoading: shortProfilesIsLoading } =
    useQuery(
      "shortProfilesData",
      () => getShortProfiles(axiosInstance, usernamesToFetch),
      {
        refetchOnWindowFocus: false,
        enabled: usernamesToFetch.length > 0,
      }
    );

  const { isLoading: championNamesIsLoading } = useQuery(
    "championNamesData",
    () => getChampionNames(axiosInstance),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const options = Object.entries(data).map(
          ([championKey, championValue]) => ({
            value: championKey,
            label: (
              <div className="flex items-center">
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championKey}.png`}
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
    }
  );

  //author
  const handleFilter = async (e) => {
    e.preventDefault();
    await refetchBuilds();
  };

  //champion
  const handleFilterChange = async (selectedOption) => {
    setFilterParams((prev) => ({
      ...prev,
      championId: selectedOption.value,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    await refetchBuilds();
  };

  //page
  const handlePageChange = async (newPage) => {
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    await refetchBuilds();
  };

  const resetFilters = async () => {
    setFilterParams({
      page: 0,
      author: "",
      championId: "",
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    await refetchBuilds();
  };

  if (buildsIsLoading || shortProfilesIsLoading || championNamesIsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (!buildsIsLoading || !shortProfilesIsLoading || !championNamesIsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center relative">
        <div
          className="absolute inset-0 bg-cover bg-fixed"
          style={{
            backgroundImage: `url('/background-images/builds.webp')`,
            opacity: "0.4",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
          }}
        ></div>
        <div
          className="absolute top-[100vh] inset-0"
          style={{
            background: "linear-gradient(to bottom, #1A273D, #131313)",
          }}
        ></div>

        <p className="mt-[10%] font-bangers text-[96px] text-amber z-20">
          {t("navbar:builds")}
        </p>
        <form
          onSubmit={handleFilter}
          className="flex flex-col items-center z-20 w-full"
        >
          <div className="flex justify-between items-center px-4 py-3 w-[30%] bg-white-smoke rounded-3xl text-[22px] font-dekko ">
            <input
              type="text"
              className="bg-transparent w-[90%] focus:outline-none text-night"
              placeholder={t("common:searchByAuthor")}
              value={filterParams.author}
              onChange={(e) =>
                setFilterParams((prev) => ({ ...prev, author: e.target.value }))
              }
            />
            <button type="submit">
              <BiSolidLock className="text-silver text-[44px] cursor-pointer hover:text-night hover:text-opacity-70 duration-150 transform-colors" />
            </button>
          </div>
        </form>
        <div className="z-20 bg-night bg-opacity-50 w-full px-[14%] mt-[3%] font-dekko">
          <div className="flex gap-x-6 items-center py-8">
            <p className="text-[28px] text-amber pr-6">{t("common:sortBy")}</p>
            <Select
              styles={customStyles}
              options={championOptions}
              onChange={handleFilterChange}
              placeholder={t("common:searchByChampion")}
              className="w-[13%]"
            />
            <div className="border-[1px] border-amber rounded-md pl-2 pr-4 py-[5px] flex items-center justify-center gap-x-2 text-[24px] cursor-pointer hover:bg-silver-hover transition-colors duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                className="text-white"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#f5f5f5"
                  d="M16.293 17.03a1.314 1.314 0 0 1-2.274 1.314l-2.144-3.717-2.144 3.717a1.312 1.312 0 1 1-2.273-1.313l2.144-3.718h-4.29a1.312 1.312 0 1 1 .001-2.626h4.289L7.457 6.969a1.312 1.312 0 0 1 2.274-1.313l2.144 3.717 2.144-3.717a1.312 1.312 0 1 1 2.273 1.313l-2.144 3.718h4.29a1.312 1.312 0 1 1 0 2.626h-4.29z"
                ></path>
              </svg>
              <p className="text-[20px]">{t("common:allRoles")}</p>
            </div>
            <div className="border-[1px] border-amber rounded-md pl-2 pr-4 py-[5px] flex items-center justify-center gap-x-2 text-[24px] cursor-pointer hover:bg-silver-hover transition-colors duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                className="text-gray-400"
                viewBox="0 0 24 24"
              >
                <g fill="#f5f5f5">
                  <path d="m19 3-4 4H7v8l-4 4V3z"></path>
                  <path d="m5 21 4-4h8V9l4-4v16z" opacity="0.2"></path>
                  <path d="M10 10h4v4h-4z" opacity="0.2"></path>
                </g>
              </svg>
              <p className="text-[20px]">{t("common:top")}</p>
            </div>
            <div className="border-[1px] border-amber rounded-md pl-2 pr-4 py-[5px] flex items-center justify-center gap-x-2 text-[24px] cursor-pointer hover:bg-silver-hover transition-colors duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                className="text-gray-400"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#f5f5f5"
                  d="M5.14 2c1.58 1.21 5.58 5.023 6.976 9.953s0 10.047 0 10.047c-2.749-3.164-5.893-5.2-6.18-5.382l-.02-.013C5.45 13.814 3 8.79 3 8.79c3.536.867 4.93 4.279 4.93 4.279C7.558 8.698 5.14 2 5.14 2m14.976 5.907s-1.243 2.471-1.814 4.604c-.235.878-.285 2.2-.29 3.058v.282c.003.347.01.568.01.568s-1.738 2.397-3.38 3.678a27.5 27.5 0 0 0-.208-5.334c.928-2.023 2.846-5.454 5.682-6.856m-2.124-5.331s-2.325 3.052-2.836 6.029c-.11.636-.201 1.194-.284 1.695-.379.584-.73 1.166-1.05 1.733-.033-.125-.06-.25-.095-.375a21 21 0 0 0-1.16-3.08c.053-.146.103-.29.17-.438 0 0 1.814-3.78 5.255-5.564"
                ></path>
              </svg>
              <p className="text-[20px]">{t("common:jungle")}</p>
            </div>
            <div className="border-[1px] border-amber rounded-md pl-2 pr-4 py-[5px] flex items-center justify-center gap-x-2 text-[24px] cursor-pointer hover:bg-silver-hover transition-colors duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                className="text-gray-400"
                viewBox="0 0 24 24"
              >
                <g fill="#f5f5f5">
                  <path
                    d="m15 3-4 4H7v4l-4 4V3zM9 21l4-4h4v-4l4-4v12z"
                    opacity="0.2"
                  ></path>
                  <path d="M18 3h3v3L6 21H3v-3z"></path>
                </g>
              </svg>
              <p className="text-[20px]">{t("common:mid")}</p>
            </div>
            <div className="border-[1px] border-amber rounded-md pl-2 pr-4 py-[5px] flex items-center justify-center gap-x-2 text-[24px] cursor-pointer hover:bg-silver-hover transition-colors duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                className="text-gray-400"
                viewBox="0 0 24 24"
              >
                <g fill="#f5f5f5">
                  <path d="m19 3-4 4H7v8l-4 4V3z" opacity="0.2"></path>
                  <path d="m5 21 4-4h8V9l4-4v16z"></path>
                  <path d="M10 10h4v4h-4z" opacity="0.2"></path>
                </g>
              </svg>
              <p className="text-[20px]">{t("common:bot")}</p>
            </div>
            <div className="border-[1px] border-amber rounded-md pl-2 pr-4 py-[5px] flex items-center justify-center gap-x-2 text-[24px] cursor-pointer hover:bg-silver-hover transition-colors duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                className="text-gray-400"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#f5f5f5"
                  d="M12.833 10.833 14.5 17.53v.804L12.833 20h-1.666L9.5 18.333v-.804l1.667-6.696zM7 7.5 9.5 10l-1.667 4.167-2.5-2.5L6.167 10h-2.5L2 7.5zm15 0L20.333 10h-2.5l.834 1.667-2.5 2.5L14.5 10 17 7.5zM13.743 5l.757.833v.834l-1.667 2.5h-1.666L9.5 6.667v-.834L10.257 5z"
                ></path>
              </svg>
              <p className="text-[20px]">{t("common:support")}</p>
            </div>
            <div
              onClick={() => resetFilters()}
              className="border-[1px] border-amber rounded-md px-5 py-[5px] flex items-center justify-center gap-x-2 text-[24px] cursor-pointer hover:bg-silver-hover transition-colors duration-150"
            >
              <p className="text-[20px]">{t("common:reset")}</p>
            </div>
          </div>
          {buildsData?.content && (
            <div className="flex flex-col gap-y-4">
              {buildsData.content.map((build, key) => {
                return (
                  <ShortBuild
                    key={key}
                    build={build}
                    shortProfilesData={shortProfilesData}
                    delete={false}
                    save={false}
                  />
                );
              })}
            </div>
          )}
          {buildsData && (
            <div className="flex justify-center items-center gap-x-4 mt-12 py-6 text-[20px]">
              {filterParams.page > 0 && (
                <p
                  className="cursor-pointer hover:text-amber duration-100 transition-colors"
                  onClick={() => handlePageChange(filterParams.page - 1)}
                >
                  {t("common:back")}
                </p>
              )}

              {Array.from({ length: 5 }, (_, i) => {
                const pageNumber = filterParams.page + i - 2;
                if (
                  pageNumber >= 0 &&
                  pageNumber < buildsData.page.totalPages
                ) {
                  return (
                    <p
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`cursor-pointer hover:text-amber duration-100 transition-colors px-3 py-1 ${
                        filterParams.page === pageNumber ? " text-amber" : ""
                      }`}
                    >
                      {pageNumber + 1}
                    </p>
                  );
                }
                return null;
              })}

              {filterParams.page < buildsData.page.totalPages - 1 && (
                <p
                  className="cursor-pointer hover:text-amber duration-100 transition-colors"
                  onClick={() => handlePageChange(filterParams.page + 1)}
                >
                  {t("common:next")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Builds;
