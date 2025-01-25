import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import getMyRiotProfiles from "../../api/riot/getMyRiotProfiles";
import getDuos from "../../api/duo/getDuos";
import getRiotShortProfiles from "../../api/riot/getRiotShortProfiles";
import answerDuo from "../../api/duo/answerDuo";
import { useQuery, useMutation } from "react-query";
import useAxios from "../../hooks/useAxios";
import Image from "next/image";
import Link from "next/link";
import Select from "react-select";
import { FaUser } from "react-icons/fa";
import { BiSolidLock } from "react-icons/bi";
import { customStylesDuo } from "@/lib/styles/championNamesList";
import DuoSettings from "./DuoSettings";
import DuoCreation from "./DuoCreation";
import LeaguePosition from "../other/LeaguePosition";
import languageTruncator from "@/lib/languageTruncator";
import getChampionNames from "../../api/ddragon/getChampionNames";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const leaguePositions = ["Top", "Jungle", "Mid", "Bot", "Support", "Fill"];

const rankList = [
  "Unranked",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];

const rankOptions = rankList.map((rank) => ({
  value: rank,
  label: (
    <div className="flex items-center">
      <Image
        src={`/rank_emblems/${rank}.png`} // Źródło obrazka ranku
        alt={rank}
        width={20}
        height={20}
      />
      <span className="ml-2">{rank}</span>
    </div>
  ),
}));

const Duo = () => {
  const { duoSettings, setDuoSettings, userData, isLogged } =
    useContext(UserContext);

  const axios = useAxios();
  const axiosPublic = useAxiosPublic();
  const axiosInstance = isLogged ? axios : axiosPublic;

  const [searchedPositions, setSearchedPositions] = useState([]);
  const [minRank, setMinRank] = useState("");
  const [maxRank, setMaxRank] = useState("");
  const [championsToFilter, setChampionsToFilter] = useState([]);
  const [languagesToFilter, setLanguagesToFilter] = useState([]);

  const { t } = useTranslation();

  const languageOptions = [
    "English",
    "German",
    "French",
    "Spanish",
    "Polish",
    "Chinese",
    "Japanese",
    "Korean",
    "Other",
  ].map((language) => ({
    value: language,
    label: t(`common:${language}`), // Pierwsza litera wielka
  }));

  //do selecta z championami
  const [championOptions, setChampionOptions] = useState([]);

  //page
  const [filterParams, setFilterParams] = useState({
    page: 0,
  });

  const [filterBody, setFilterBody] = useState({
    positions: searchedPositions,
    minRank: minRank,
    maxRank: maxRank,
    champions: championsToFilter,
    languages: languagesToFilter,
  });

  //claimed accounts
  const {
    data: riotProfiles,
    error,
    isLoading,
  } = useQuery("myRiotProfiles", () => getMyRiotProfiles(axiosInstance), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log(data);
      if (data && data.length === 1) {
        setDuoSettings((prevSettings) => ({
          ...prevSettings,
          duoAccount: data[0],
        }));
      }
    },
  });

  const {
    refetch: refetchDuos,
    data: duos,
    error: duosError,
    isLoading: duosLoading,
  } = useQuery(
    "duos",
    () => getDuos(axiosInstance, filterBody, filterParams.page),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    refetch: riotShortProfilesRefetch,
    data: riotShortProfiles,
    error: riotShortProfilesError,
    isLoading: riotShortProfilesLoading,
  } = useQuery(
    "riotShortProfiles",
    () => getRiotShortProfiles(axiosInstance, duos),
    {
      refetchOnWindowFocus: false,
      enabled: !!duos && !!duos.content, // Sprawdź, czy duos są dostępne
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

  //champions
  const handleSelectChange = (selectedOption) => {
    setFilterBody({
      ...filterBody,
      champions: selectedOption.map((option) => option.value), // Aktualizujemy champions w filterBody
    });
  };

  //languages
  const handleLanguagesChange = (selectedOption) => {
    setFilterBody({
      ...filterBody,
      languages: selectedOption.map((option) => option.value), // Aktualizujemy languages w filterBody
    });
  };

  //minrank
  const handleMinRankChange = (selectedOption) => {
    setFilterBody({
      ...filterBody,
      minRank: selectedOption.value, // Aktualizujemy minRank w filterBody
    });
  };

  //maxrank
  const handleMaxRankChange = (selectedOption) => {
    setFilterBody({
      ...filterBody,
      maxRank: selectedOption.value, // Aktualizujemy maxRank w filterBody
    });
  };

  const { mutateAsync: answerDuoMutation } = useMutation(
    ({ puuid, duoId }) => answerDuo(axiosInstance, puuid, duoId),
    {
      onSuccess: () => {
        console.log("Duo answered successfully");
        toast.success("Duo answered successfully");
      },
      onError: () => {
        console.error("Error answering duo");
      },
    }
  );

  const handlePageChange = async (newPage) => {
    // Zaktualizuj tylko numer strony
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    // Ponowne pobranie danych po zmianie strony
    await refetchDuos();
  };

  useEffect(() => {
    if (duos && duos.content) {
      riotShortProfilesRefetch();
    }
  }, [duos]);

  useEffect(() => {
    console.log("refetching duos", filterBody);
    const refetch = async () => {
      await refetchDuos();
    };

    refetch();
  }, [filterBody]);

  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen w-full flex justify-between px-[5%] bg-night">
      <div
        className="absolute inset-0 bg-cover bg-fixed"
        style={{
          backgroundImage: `url('/background-images/duos.webp')`,
          opacity: "0.4",
          backgroundSize: "cover", // Nie powiększa obrazu
          backgroundPosition: "center", // Ustawienie środka obrazu
          backgroundRepeat: "no-repeat", // Zapobiega powtarzaniu
          width: "100%",
          height: "100vh", // Obraz będzie rozciągał się na wysokość widoku
        }}
      ></div>
      <div className="mt-[10%] w-[25%] flex flex-col gap-y-2 z-20 font-chewy">
        {isLogged && <DuoCreation></DuoCreation>}

        {riotProfiles?.length === 1 ? (
          <div className="mt-[2%] flex gap-x-2 justify-between items-center bg-silver bg-opacity-15 rounded-xl px-4 py-2 text-[20px] w-[80%]">
            <div className="flex gap-x-3 items-center">
              {riotProfiles[0].profileIconId ? (
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/" +
                    "14.24.1" +
                    "/img/profileicon/" +
                    riotProfiles[0].profileIconId +
                    ".png"
                  }
                  height={40}
                  width={40}
                  alt="summoner icon"
                  className="rounded-full"
                />
              ) : (
                <div className="w-[40px] h-[40px] flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                  <FaUser className="text-[20px]"></FaUser>
                </div>
              )}
              {riotProfiles[0].gameName ? (
                <p>
                  {riotProfiles[0].gameName.length > 24
                    ? `${riotProfiles[0].gameName.slice(0, 24)}...`
                    : riotProfiles[0].gameName}
                </p>
              ) : (
                <p> {t("duo:summoner")}</p>
              )}
            </div>
            {riotProfiles[0].tier === "" || riotProfiles[0].tier === null ? (
              <p className="text-[14px]">Unranked</p>
            ) : (
              <Image
                src={"/rank_emblems/" + riotProfiles[0].tier + ".png"}
                height={48}
                width={48}
                alt="rank_emlblem"
              />
            )}
          </div>
        ) : (
          isLogged && <DuoSettings riotProfiles={riotProfiles}></DuoSettings>
        )}

        <p className="text-[20px] mt-[4%]">{t("duo:lookingFor")}</p>
        <div className="flex flex-wrap items-center gap-2">
          {leaguePositions.map((position, key) => {
            return (
              <div
                className={`flex items-center gap-x-2 rounded-xl bg-silver bg-opacity-15 px-5 py-2 text-[18px] cursor-pointer transition-all duration-150 hover:bg-night hover:bg-opacity-25 ${
                  filterBody.positions.includes(position)
                    ? "outline outline-[1px] outline-white-smoke"
                    : ""
                }`}
                key={key}
                onClick={() => {
                  if (filterBody.positions.includes(position)) {
                    setFilterBody({
                      ...filterBody,
                      positions: filterBody.positions.filter(
                        (pos) => pos !== position
                      ),
                    });
                  } else {
                    setFilterBody({
                      ...filterBody,
                      positions: [...filterBody.positions, position],
                    });
                  }
                }}
              >
                <LeaguePosition position={position} height={32} />
                <p>{t(`common:${position}`)}</p>
              </div>
            );
          })}
        </div>
        <p className="text-[20px] mt-[4%]">{t("duo:ranks")}</p>
        <div className="flex justify-between items-center w-[80%]">
          <Select
            styles={customStylesDuo}
            options={rankOptions}
            onChange={handleMinRankChange}
            placeholder={t("duo:minRank")}
            className="w-[48%]"
          />
          <Select
            styles={customStylesDuo}
            options={rankOptions}
            onChange={handleMaxRankChange}
            placeholder={t("duo:maxRank")}
            className="w-[48%]"
          />
        </div>
        <p className="text-[20px] mt-[4%]">{t("duo:championsPlayed")}</p>
        <Select
          styles={customStylesDuo}
          options={championOptions}
          onChange={handleSelectChange}
          isMulti
          placeholder={t("duo:chooseChampion")}
          className="w-[80%]"
        />
        <p className="text-[20px] mt-[4%]">{t("duo:myDuoSpeaks")}</p>
        <Select
          styles={customStylesDuo}
          options={languageOptions}
          onChange={handleLanguagesChange}
          isMulti
          placeholder={t("duo:chooseLanguages")}
          className="w-[80%]"
        />
      </div>
      <div className="mt-[9%] w-[75%] flex flex-col gap-y-4 z-20 font-chewy">
        <p className="font-bangers text-[64px] text-amber text-center">Duo</p>
        <div className="flex items-center w-full">
          <p className="text-silver w-[15%] text-center">{t("duo:summoner")}</p>
          <p className="text-silver w-[20%] text-center">
            {t("duo:playedPositions")}
          </p>
          <p className="text-silver w-[5%] text-center">{t("duo:rank")}</p>
          <p className="text-silver w-[20%] text-center">
            {t("duo:searchedPositions")}
          </p>
          <p className="text-silver w-[10%] text-center">
            {t("duo:searchedRanks")}
          </p>
          <p className="text-silver w-[15%] text-center">
            {t("duo:playedChampions")}
          </p>
          <p className="text-silver w-[10%] text-center">
            {t("duo:languages")}
          </p>
        </div>
        <div className="flex flex-col gap-y-4 w-full text-opacity-90">
          {duos &&
            duos.content?.map((duo, key) => {
              const shortProfile = riotShortProfiles?.find(
                (profile) =>
                  profile.puuid === duo.puuid.split("_").slice(1).join("_")
              );

              return (
                <div
                  key={key}
                  className="w-full bg-night bg-opacity-70 rounded-xl flex items-center border-[1px] border-white-smoke hover:bg-silver hover:bg-opacity-5 transition-all duration-150 px-4 py-3 text-[24px] h-[60px]"
                >
                  <div className="w-[15%] flex items-center gap-x-3">
                    {shortProfile?.profileIconId ? (
                      <Image
                        src={
                          "https://ddragon.leagueoflegends.com/cdn/" +
                          "14.24.1" +
                          "/img/profileicon/" +
                          shortProfile.profileIconId +
                          ".png"
                        }
                        height={40}
                        width={40}
                        alt="summoner icon"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-[40px] h-[40px] flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                        <FaUser className="text-[20px]"></FaUser>
                      </div>
                    )}

                    {shortProfile?.gameName ? (
                      <Link
                        className="hover:text-amber transition-all duration-150"
                        href={
                          "/summoner/" +
                          shortProfile.server +
                          "/" +
                          shortProfile.tagLine +
                          "/" +
                          shortProfile.gameName
                        }
                      >
                        {shortProfile.gameName.length > 12
                          ? `${shortProfile.gameName.slice(0, 12)}...`
                          : shortProfile.gameName}
                      </Link>
                    ) : (
                      <p>Summoner</p>
                    )}
                  </div>
                  <div className="w-[20%] flex items-center justify-center gap-x-2">
                    {duo.positions?.map((position, key) => {
                      return (
                        <LeaguePosition
                          key={key}
                          position={position}
                          height={40}
                        />
                      );
                    })}
                  </div>
                  <div className="w-[5%] flex items-center justify-center gap-x-2">
                    {shortProfile?.tier === "" ||
                    shortProfile?.tier === null ? (
                      <p className="text-[14px]">Unranked</p>
                    ) : (
                      <Image
                        src={"/rank_emblems/" + shortProfile?.tier + ".png"}
                        height={48}
                        width={48}
                        alt="rank_emlblem"
                      />
                    )}
                  </div>
                  <div className="w-[20%] flex items-center justify-center gap-x-2">
                    {duo.lookedPositions?.map((position, key) => {
                      return (
                        <LeaguePosition
                          key={key}
                          position={position}
                          height={40}
                        />
                      );
                    })}
                  </div>
                  <div className="w-[10%] flex items-center justify-center gap-x-2">
                    {duo.minRank === "" || duo.minRank === null ? (
                      <LeaguePosition position={"Fill"} height={32} />
                    ) : (
                      <Image
                        src={"/rank_emblems/" + duo.minRank + ".png"}
                        width={48}
                        height={48}
                        alt={duo.minRank}
                      />
                    )}
                    <p>-</p>
                    {duo.maxRank === "" || duo.maxRank === null ? (
                      <LeaguePosition position={"Fill"} height={32} />
                    ) : (
                      <Image
                        src={"/rank_emblems/" + duo.maxRank + ".png"}
                        width={48}
                        height={48}
                        alt={duo.maxRank}
                      />
                    )}
                  </div>
                  <div className="w-[15%] flex items-center justify-center gap-x-2">
                    {duo.championIds?.slice(0, 3).map((champion, key) => {
                      return (
                        <Image
                          key={key}
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/" +
                            "14.24.1" +
                            "/img/champion/" +
                            champion +
                            ".png"
                          }
                          height={40}
                          width={40}
                        />
                      );
                    })}
                  </div>
                  <div className="w-[12%] flex items-center justify-center gap-x-2">
                    {duo.languages?.map((language, key) => {
                      return (
                        <p key={key} className="">
                          {languageTruncator(language)}
                        </p>
                      );
                    })}
                  </div>
                  {isLogged && (
                    <div className="w-[3%] flex items-center justify-center">
                      {duo.author !== userData?.username && (
                        <BiSolidLock
                          onClick={() => {
                            console.log("dodawanie duo");
                            answerDuoMutation({
                              puuid: riotProfiles[0].puuid,
                              duoId: duo._id,
                            });
                          }}
                          className="text-[32px] hover:text-amber duration-150 transition-all cursor-pointer"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        {duos && (
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
              if (pageNumber >= 0 && pageNumber < duos.page.totalPages) {
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
            {filterParams.page < duos.page.totalPages - 1 && (
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
};

export default Duo;
