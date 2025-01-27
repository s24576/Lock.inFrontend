"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "react-query";
import getMyBuilds from "../../api/builds/getMyBuilds";
import getShortProfiles from "../../api/profile/getShortProfiles";
import ShortBuild from "./ShortBuild";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const MyBuilds = () => {
  const [filterParams, setFilterParams] = useState({
    page: 0,
  });
  const { isLogged } = useContext(UserContext);
  const router = useRouter();

  const { t } = useTranslation();

  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  const [championOptions, setChampionOptions] = useState([]);

  const axiosInstance = useAxios();

  const {
    refetch: refetchBuilds,
    data: buildsData,
    error: buildsError,
    isLoading: buildsIsLoading,
  } = useQuery(
    "buildsData",
    () => getMyBuilds(axiosInstance, filterParams.page),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const usernames = data?.content?.map((build) => build.username);
        setUsernamesToFetch(usernames);
      },
    }
  );

  const {
    refetch: shortProfilesRefetch,
    data: shortProfilesData,
    error: shortProfilesError,
    isLoading: shortProfilesIsLoading,
  } = useQuery(
    "shortProfilesData",
    () => getShortProfiles(axiosInstance, usernamesToFetch),
    {
      refetchOnWindowFocus: false,
      enabled: usernamesToFetch?.length > 0,
    }
  );

  //page
  const handlePageChange = async (newPage) => {
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    await refetchBuilds();
  };

  if (buildsIsLoading || shortProfilesIsLoading || isLogged === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (isLogged === false) {
    router.push("/");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night font-dekko">
        <p className="text-amber text-[40px] animate-pulse ">
          {t("common:redirecting")}
        </p>
      </div>
    );
  }

  if (isLogged && !buildsIsLoading && !shortProfilesIsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center relative">
        <div
          className="absolute inset-0 bg-cover bg-fixed"
          style={{
            backgroundImage: `url('/background-images/mybuilds.webp')`,
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
            background: "linear-gradient(to bottom, #16182F, #131313)",
          }}
        ></div>

        <p className="mt-[10%] font-bangers text-[96px] text-amber z-20">
          {t("builds:myBuilds")}
        </p>
        {buildsData?.content && buildsData.content.length > 0 ? (
          <div className="z-20 bg-night bg-opacity-50 w-full px-[14%] mt-[7%] py-[2%] font-dekko">
            {buildsData?.content && (
              <div className="flex flex-col gap-y-4">
                {buildsData.content.map((build, key) => {
                  return (
                    <ShortBuild
                      key={key}
                      build={build}
                      shortProfilesData={shortProfilesData}
                      delete={true}
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
        ) : (
          <div>
            <p className="z-20 text-[32px] font-dekko text-white-smoke mt-[7%]">
              {t("builds:myBuildsInfo")}
            </p>
          </div>
        )}
      </div>
    );
  }
};
