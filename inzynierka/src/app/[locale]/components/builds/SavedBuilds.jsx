"use client";
import React, { useState, useContext, use } from "react";
import { UserContext } from "../../context/UserContext";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "react-query";
import getSavedBuilds from "../../api/builds/getSavedBuilds";
import getShortProfiles from "../../api/profile/getShortProfiles";
import ShortBuild from "./ShortBuild";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const SavedBuilds = () => {
  const [filterParams, setFilterParams] = useState({
    page: 0,
  });

  const { isLogged } = useContext(UserContext);
  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  const [championOptions, setChampionOptions] = useState([]);

  const axiosInstance = useAxios();
  const router = useRouter();

  const {
    refetch: refetchBuilds,
    data: buildsData,
    error: buildsError,
    isLoading: buildsIsLoading,
  } = useQuery(
    "buildsData",
    () => getSavedBuilds(axiosInstance, filterParams.page),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // Wyekstrahuj username z każdego obiektu i przypisz do zmiennej
        const usernames = data?.content?.map((build) => build.username);
        // Przypisz do odpowiedniej zmiennej lub użyj setUsernamesToFollow
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
    // Zaktualizuj tylko numer strony
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    // Ponowne pobranie danych po zmianie strony
    await refetchBuilds();
  };

  const { t } = useTranslation();

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-night font-chewy">
        <p className="text-amber text-[40px] animate-pulse ">
          {t("common:redirecting")}
        </p>
      </div>
    );
  }

  if (isLogged) {
    return (
      <div className="min-h-screen flex flex-col items-center relative">
        <div
          className="absolute inset-0 bg-cover bg-fixed"
          style={{
            backgroundImage: `url('/background-images/savedbuilds.webp')`,
            opacity: "0.4",
            backgroundSize: "cover", // Nie powiększa obrazu
            backgroundPosition: "center", // Ustawienie środka obrazu
            backgroundRepeat: "no-repeat", // Zapobiega powtarzaniu
            width: "100%",
            height: "100vh", // Obraz będzie rozciągał się na wysokość widoku
          }}
        ></div>
        <div
          className="absolute top-[100vh] inset-0"
          style={{
            background: "linear-gradient(to bottom, #161820, #131313)",
          }}
        ></div>

        <p className="mt-[10%] font-bangers text-[96px] text-amber z-20">
          {t("builds:savedBuilds")}
        </p>
        {buildsData?.content && buildsData.content.length > 0 ? (
          <div className="z-20 bg-night bg-opacity-50 w-full px-[14%] mt-[7%] py-[2%] font-chewy">
            {buildsData?.content && (
              <div className="flex flex-col gap-y-4">
                {buildsData.content.map((build, key) => {
                  return (
                    <ShortBuild
                      key={key}
                      build={build}
                      shortProfilesData={shortProfilesData}
                      delete={false}
                      saved={true}
                    />
                  );
                })}
              </div>
            )}
            {buildsData && (
              <div className="flex justify-center items-center gap-x-4 mt-12 py-6 text-[20px]">
                {/* Jeśli strona jest większa niż 1, wyświetl przycisk "Back" */}
                {filterParams.page > 0 && (
                  <p
                    className="cursor-pointer hover:text-amber duration-100 transition-colors"
                    onClick={() => handlePageChange(filterParams.page - 1)}
                  >
                    {t("common:back")}
                  </p>
                )}

                {/* Wyświetl numery stron w zakresie 5 stron */}
                {Array.from({ length: 5 }, (_, i) => {
                  const pageNumber = filterParams.page + i - 2; // Tworzymy tablicę z 5 stron
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

                {/* Jeśli strona jest mniejsza niż ostatnia, wyświetl przycisk "Next" */}
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
            <p className="z-20 text-[32px] font-chewy text-white-smoke mt-[7%]">
              {t("builds:savedBuildsInfo")}
            </p>
          </div>
        )}
      </div>
    );
  }
};
