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

const leaguePositions = ["Fill", "Top", "Jungle", "Mid", "Bot", "Support"];

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
  label: language.charAt(0).toUpperCase() + language.slice(1), // Pierwsza litera wielka
}));

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

const DuoCreation = () => {
  const axiosInstance = useAxios();

  const { version } = useContext(SearchContext);
  const { duoSettings } = useContext(UserContext);

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
    //dopisac axiosInstance do getChampionNames
  } = useQuery("championNames", () => getChampionNames(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  //champions
  const handleSelectChange = (selectedOption) => {
    const selectedChampions = selectedOption.map((option) => option.value);

    if (selectedChampions.length > 3) {
      return; // Nie dodawaj więcej, jeśli liczba championów przekracza 3
    }

    setDuoBody({
      ...duoBody,
      championIds: selectedChampions, // Aktualizujemy champions w filterBody
    });
  };

  //languages
  const handleLanguagesChange = (selectedOption) => {
    const selectedLanguages = selectedOption.map((option) => option.value);

    if (selectedLanguages.length > 3) {
      return; // Nie dodawaj więcej, jeśli liczba języków przekracza 3
    }

    setDuoBody({
      ...duoBody,
      languages: selectedLanguages, // Aktualizujemy languages w filterBody
    });
  };

  //minrank
  const handleMinRankChange = (selectedOption) => {
    setDuoBody({
      ...duoBody,
      minRank: selectedOption.value, // Aktualizujemy minRank w filterBody
    });
  };

  //maxrank
  const handleMaxRankChange = (selectedOption) => {
    setDuoBody({
      ...duoBody,
      maxRank: selectedOption.value, // Aktualizujemy maxRank w filterBody
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
      },
      onError: (error) => {
        console.error("Error creating duo:", error);
      },
    }
  );

  const handleSubmit = async () => {
    console.log(duoBody);
    console.log(duoSettings.duoAccount);

    // Nadpisanie pola puuid wartością z duoSettings
    const updatedFormData = {
      ...duoBody,
      puuid: duoSettings.duoAccount.server + "_" + duoSettings.duoAccount.puuid,
    };

    console.log(updatedFormData);

    try {
      await mutateAsync(updatedFormData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-x-2 cursor-pointer hover:text-amber duration-150 transition-all font-chewy">
          <FaEdit className="text-[28px]" />
          <p className="text-[20px]">Create duo</p>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-night border-[1px] border-amber font-chewy">
        <DialogHeader>
          <DialogTitle>
            <p className="font-normal">Create duo</p>
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
                    "14.24.1" +
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
                <p>Summoner</p>
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
          <p>No account chosen - select one in duo settings</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className=""
        >
          <p>I'm looking for:</p>
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
                      updatedPositions = ["Fill"]; // Jeśli wybieramy "Fill", tylko "Fill" pozostaje
                    } else if (duoBody.lookedPositions.includes("Fill")) {
                      updatedPositions = [position]; // Jeśli mamy "Fill" i klikamy inną rangę, resetujemy do wybranej rangi
                    } else if (newPositions.length > 4) {
                      updatedPositions = ["Fill"]; // Jeśli więcej niż 4 rangi, resetujemy do "Fill"
                    } else {
                      updatedPositions = newPositions; // Normalne dodawanie/usuwanie pozycji
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

          <p className="mt-[3%]">I play:</p>
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
                      updatedPositions = ["Fill"]; // Jeśli wybieramy "Fill", tylko "Fill" pozostaje
                    } else if (duoBody.positions.includes("Fill")) {
                      updatedPositions = [position]; // Jeśli mamy "Fill" i klikamy inną rangę, resetujemy do wybranej rangi
                    } else if (newPositions.length > 4) {
                      updatedPositions = ["Fill"]; // Jeśli więcej niż 4 rangi, resetujemy do "Fill"
                    } else {
                      updatedPositions = newPositions; // Normalne dodawanie/usuwanie pozycji
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
          <p className="mt-[3%] py-1">I'm looking for someone between:</p>
          <div className="flex justify-between items-center w-[100%] mt-[1%]">
            <Select
              styles={customStylesDuo}
              options={rankOptions}
              onChange={handleMinRankChange}
              placeholder="Min rank"
              className="w-[48%]"
            />
            <Select
              styles={customStylesDuo}
              options={rankOptions}
              onChange={handleMaxRankChange}
              placeholder="Max rank"
              className="w-[48%]"
            />
          </div>
          <p className="mt-[3%] py-1">My chmapions:</p>
          <Select
            styles={customStylesDuo}
            options={championOptions}
            onChange={handleSelectChange}
            isMulti
            placeholder="Choose champions (First 3 will be saved)"
            className="w-[100%]"
          />

          <p className="mt-[3%] py-1">My duo speaks:</p>
          <Select
            styles={customStylesDuo}
            options={languageOptions}
            onChange={handleLanguagesChange}
            isMulti
            placeholder="Choose champions (First 3 will be saved)"
            className="w-[100%]"
          />

          <DialogClose>
            <button
              type="submit"
              className="w-[40%] px-4 py-2 border-2 border-white-smoke text-[20px] rounded-3xl mt-[6%] hover:bg-silver hover:bg-opacity-15 duration-150 transition-all mx-auto block"
            >
              Submit
            </button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DuoCreation;
