import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/componentsShad/ui/dialog";
import { FaEdit } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import useAxios from "../../hooks/useAxios";
import { UserContext } from "../../context/UserContext";
import { SearchContext } from "../../context/SearchContext";
import { useQuery, useMutation } from "react-query";
import getChampionNames from "../../api/ddragon/getChampionNames";
import createDuo from "../../api/duo/createDuo";
import Select from "react-select";
import { customStyles, customStylesDuo } from "@/lib/styles/championNamesList";
import Image from "next/image";
import LeaguePosition from "../other/LeaguePosition";
import { useTranslation } from "react-i18next";

const leaguePositions = ["Fill", "Top", "Jungle", "Mid", "Bot", "Support"];

const rankList = [
  "Unranked",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
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
        src={`/rank_emblems/${rank}.png`}
        alt={rank}
        width={20}
        height={20}
      />
      <span className="ml-2">{rank}</span>
    </div>
  ),
}));

const DuoCreation = () => {
  const axiosInstance = useAxios();

  const { version } = useContext(SearchContext);
  const { duoSettings } = useContext(UserContext);

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
    label: t(`common:${language}`),
  }));

  const [duoBody, setDuoBody] = useState({
    positions: [],
    lookedPositions: [],
    minRank: "",
    maxRank: "",
    languages: [],
    championIds: [],
  });

  const {
    data: championNames,
    error: championNamesError,
    isLoading: championNamesLoading,
  } = useQuery("championNames", () => getChampionNames(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  //champions
  const handleSelectChange = (selectedOption) => {
    const selectedChampions = selectedOption
      .slice(0, 3)
      .map((option) => option.value);

    setDuoBody({
      ...duoBody,
      championIds: selectedChampions,
    });
  };

  //languages
  const handleLanguagesChange = (selectedOption) => {
    const selectedLanguages =
      selectedOption && selectedOption.length > 0
        ? selectedOption.slice(0, 3).map((option) => option.value)
        : ["Other"];

    setDuoBody({
      ...duoBody,
      languages: selectedLanguages,
    });
  };

  //minrank
  const handleMinRankChange = (selectedOption) => {
    setDuoBody({
      ...duoBody,
      minRank: selectedOption.value,
    });
  };

  //maxrank
  const handleMaxRankChange = (selectedOption) => {
    setDuoBody({
      ...duoBody,
      maxRank: selectedOption.value,
    });
  };

  //mapowanie nazw championow na obiekt do react-select
  const championOptions = championNames
    ? Object.entries(championNames).map(([championKey, championValue]) => ({
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
      }))
    : [];

  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync } = useMutation(
    (formData) => createDuo(axiosInstance, formData),
    {
      onSuccess: (data) => {
        console.log("Duo created successfully:", data);
        setDuoBody({
          positions: [],
          lookedPositions: [],
          minRank: "",
          maxRank: "",
          languages: [],
          championIds: [],
        });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error("Error creating duo:", error);
        setValidationError(t("duo:submitError"));
      },
    }
  );

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async () => {
    setValidationError("");

    if (!duoSettings.duoAccount) {
      setValidationError(t("duo:noAccountError"));
      return;
    }

    if (duoBody.positions.length === 0) {
      setValidationError(t("duo:positionsRequired"));
      return;
    }

    if (duoBody.lookedPositions.length === 0) {
      setValidationError(t("duo:lookedPositionsRequired"));
      return;
    }

    if (!duoBody.minRank || !duoBody.maxRank) {
      setValidationError(t("duo:ranksRequired"));
      return;
    }

    const rankOrder =
      rankList.indexOf(duoBody.minRank) > rankList.indexOf(duoBody.maxRank);
    if (rankOrder) {
      setValidationError(t("duo:invalidRankRange"));
      return;
    }

    const updatedFormData = {
      ...duoBody,
      puuid:
        duoSettings?.duoAccount?.server + "_" + duoSettings?.duoAccount?.puuid,
    };

    try {
      await mutateAsync(updatedFormData);
    } catch (error) {
      console.error(error);
      setValidationError(t("duo:submitError"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-x-2 cursor-pointer hover:text-amber duration-150 transition-all font-dekko">
          <FaEdit className="text-[28px]" />
          <p className="text-[20px]">{t("duo:createDuo")}</p>
        </div>
      </DialogTrigger>
      <DialogContent
        className="bg-night border-[1px] border-amber font-dekko fixed top-[5vh] translate-y-0"
        style={{
          transform: "translate(-50%, 0)",
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <p className="font-normal">{t("duo:createDuo")}</p>
          </DialogTitle>
          <DialogClose />
        </DialogHeader>
        {duoSettings.duoAccount ? (
          <div className="flex gap-x-2 justify-between items-center bg-silver bg-opacity-15 rounded-xl px-4 py-2 text-[16px] w-[100%]">
            <div className="flex gap-x-3 items-center">
              {duoSettings?.duoAccount?.profileIconId ? (
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/" +
                    version +
                    "/img/profileicon/" +
                    duoSettings?.duoAccount?.profileIconId +
                    ".png"
                  }
                  height={30}
                  width={30}
                  alt="summoner icon"
                  className="rounded-full"
                />
              ) : (
                <div className="w-[30px] h-[30px] flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                  <FaUser className="text-[15px]"></FaUser>
                </div>
              )}
              {duoSettings?.duoAccount?.gameName ? (
                <p>
                  {duoSettings?.duoAccount.gameName.length > 24
                    ? `${duoSettings?.duoAccount.gameName.slice(0, 24)}...`
                    : duoSettings?.duoAccount.gameName}
                </p>
              ) : (
                <p>{t("duo:summoner")}</p>
              )}
            </div>
            {duoSettings?.duoAccount?.tier === "" ||
            duoSettings?.duoAccount?.tier === null ? (
              <p className="text-[14px]">Unranked</p>
            ) : (
              <Image
                src={"/rank_emblems/" + duoSettings?.duoAccount?.tier + ".png"}
                height={30}
                width={30}
                alt={duoSettings?.duoAccount?.tier}
              />
            )}
          </div>
        ) : (
          <p>{t("duo:noAccount")}</p>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit();
          }}
          className="w-full justify-center flex flex-col"
        >
          <p>{t("duo:lookingFor")}</p>
          <div className="flex items-center gap-x-2">
            {leaguePositions.map((position, key) => {
              return (
                <div
                  className={`bg-silver bg-opacity-15 rounded-xl p-4 hover:bg-night hover:bg-opacity-25 transition-all duration-150 cursor-pointer ${
                    duoBody.lookedPositions.includes(position)
                      ? "outline outline-[1px] outline-white-smoke"
                      : ""
                  }`}
                  key={key}
                  onClick={() => {
                    const isFill = position === "Fill";
                    const newPositions = duoBody.lookedPositions.includes(
                      position
                    )
                      ? duoBody.lookedPositions.filter(
                          (pos) => pos !== position
                        )
                      : [...duoBody.lookedPositions, position];

                    let updatedPositions;

                    if (isFill) {
                      updatedPositions = ["Fill"];
                    } else if (duoBody.lookedPositions.includes("Fill")) {
                      updatedPositions = [position];
                    } else if (newPositions.length > 4) {
                      updatedPositions = ["Fill"];
                    } else {
                      updatedPositions = newPositions;
                    }

                    setDuoBody({
                      ...duoBody,
                      lookedPositions: updatedPositions,
                    });
                  }}
                >
                  <LeaguePosition position={position} height={24} />
                </div>
              );
            })}
          </div>

          <p className="mt-[3%]">{t("duo:iPlay")}</p>
          <div className="flex items-center gap-x-2">
            {leaguePositions.map((position, key) => {
              return (
                <div
                  className={`bg-silver bg-opacity-15 rounded-xl p-4 hover:bg-night hover:bg-opacity-25 transition-all duration-150 cursor-pointer ${
                    duoBody.positions.includes(position)
                      ? "outline outline-[1px] outline-white-smoke"
                      : ""
                  }`}
                  key={key}
                  onClick={() => {
                    const isFill = position === "Fill";
                    const newPositions = duoBody.positions.includes(position)
                      ? duoBody.positions.filter((pos) => pos !== position)
                      : [...duoBody.positions, position];

                    let updatedPositions;

                    if (isFill) {
                      updatedPositions = ["Fill"];
                    } else if (duoBody.positions.includes("Fill")) {
                      updatedPositions = [position];
                    } else if (newPositions.length > 4) {
                      updatedPositions = ["Fill"];
                    } else {
                      updatedPositions = newPositions;
                    }

                    setDuoBody({
                      ...duoBody,
                      positions: updatedPositions,
                    });
                  }}
                >
                  <LeaguePosition position={position} height={24} />
                </div>
              );
            })}
          </div>
          <p className="mt-[3%] py-1">{t("duo:lookingBetween")}</p>
          <div className="flex justify-between items-center w-[100%] mt-[1%]">
            <Select
              styles={customStylesDuo}
              options={rankOptions}
              onChange={handleMinRankChange}
              placeholder={t("duo:maxRank")}
              className="w-[48%]"
            />
            <Select
              styles={customStylesDuo}
              options={rankOptions}
              onChange={handleMaxRankChange}
              placeholder={t("duo:minRank")}
              className="w-[48%]"
            />
          </div>
          <p className="mt-[3%] py-1">{t("duo:myChampions")}</p>
          <Select
            styles={customStylesDuo}
            options={championOptions}
            onChange={handleSelectChange}
            isMulti
            placeholder={t("duo:chooseChampions")}
            className="w-[100%]"
          />

          <p className="mt-[3%] py-1">{t("duo:myDuoSpeaks")}</p>
          <Select
            styles={customStylesDuo}
            options={languageOptions}
            onChange={handleLanguagesChange}
            isMulti
            placeholder={t("duo:chooseLanguagesAlt")}
            className="w-[100%]"
          />

          {validationError && (
            <p className="text-amber text-center mt-2">{validationError}</p>
          )}
          <button
            type="submit"
            className="w-[100%] px-4 py-2 border-2 border-white-smoke text-[20px] rounded-3xl mt-[8%] hover:bg-silver hover:bg-opacity-15 duration-150 transition-all mx-auto block"
          >
            {t("common:submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DuoCreation;
