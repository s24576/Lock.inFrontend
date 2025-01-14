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
import useAxios from "../../hooks/useAxios";
import { UserContext } from "../../context/UserContext";
import { SearchContext } from "../../context/SearchContext";
import { useQuery, useMutation } from "react-query";
import getChampionNames from "../../api/ddragon/getChampionNames";
import createDuo from "../../api/duo/createDuo";
import Select from "react-select";
import { customStyles } from "@/lib/styles/championNamesList";
import Image from "next/image";

const DuoCreation = () => {
  const axiosInstance = useAxios();

  const { version } = useContext(SearchContext);
  const { duoSettings } = useContext(UserContext);

  const {
    data: championNames,
    error: championNamesError,
    isLoading: championNamesLoading,
    //dopisac axiosInstance do getChampionNames
  } = useQuery("championNames", () => getChampionNames(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  const [formData, setFormData] = useState({
    positions: [],
    minRank: "",
    minRankDivision: "",
    maxRank: "",
    maxRankDivision: "",
    languages: [],
    championIds: [],
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const updatedArray = checked
          ? [...prevFormData[name], value]
          : prevFormData[name].filter((item) => item !== value);
        return { ...prevFormData, [name]: updatedArray };
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prevValues) => ({
      ...prevValues,
      championIds: selectedOption.map((option) => option.value),
    }));
  };

  //renderowanie inputu do wyboru dywizji jesli nie jest to master, grandmaster lub challenger
  const renderDivisionSelect = (rankType) => {
    const rank = formData[rankType];
    if (["Master", "Grandmaster", "Challenger"].includes(rank)) {
      return null;
    }
    return (
      <select
        name={`${rankType}Division`}
        value={formData[`${rankType}Division`]}
        onChange={handleInputChange}
      >
        <option value="">Select Division</option>
        <option value="IV">IV</option>
        <option value="III">III</option>
        <option value="II">II</option>
        <option value="I">I</option>
      </select>
    );
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
      },
      onError: (error) => {
        console.error("Error creating duo:", error);
      },
    }
  );

  const handleSubmit = async () => {
    console.log(formData);
    console.log(duoSettings.duoAccount);

    // Nadpisanie pola puuid wartością z duoSettings
    const updatedFormData = {
      ...formData,
      puuid: duoSettings.duoAccount.server + "_" + duoSettings.duoAccount.puuid,
    };

    // Sprawdzenie, czy któreś z pól jest puste, z wyjątkiem minRankDivision i maxRankDivision dla Master, Grandmaster, Challenger
    const isEmptyField = Object.entries(updatedFormData).some(
      ([key, value]) => {
        if (
          (key === "minRankDivision" &&
            ["Master", "Grandmaster", "Challenger"].includes(
              updatedFormData.minRank
            )) ||
          (key === "maxRankDivision" &&
            ["Master", "Grandmaster", "Challenger"].includes(
              updatedFormData.maxRank
            ))
        ) {
          return false;
        }
        return value === "" || (Array.isArray(value) && value.length === 0);
      }
    );

    if (isEmptyField) {
      console.error("Niektóre pola są puste");
      return;
    }

    try {
      await mutateAsync(updatedFormData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-x-2 cursor-pointer hover:text-amber duration-150 transition-all">
          <FaEdit className="text-[28px]" />
          <p className="text-[20px]">Create duo</p>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-oxford-blue">
        <DialogHeader>
          <DialogTitle>Create duo</DialogTitle>
          <DialogClose />
        </DialogHeader>
        {duoSettings.duoAccount ? (
          <div className="flex gap-x-4 items-center hover:bg-[#1a1a1a] cursor-pointer rounded-2xl">
            <Image
              src={
                "https://ddragon.leagueoflegends.com/cdn/" +
                version +
                "/img/profileicon/" +
                duoSettings.duoAccount.profileIconId +
                ".png"
              }
              width={50}
              height={50}
              alt="summonerIcon"
              className="rounded-full border-2 border-white"
            />
            <p>{duoSettings.duoAccount.gameName}</p>
            <p>{duoSettings.duoAccount.server}</p>
            <p>{duoSettings.duoAccount.summonerLevel} lvl</p>
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
          <div>
            <label>Positions:</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="positions"
                  value="Top"
                  checked={formData.positions.includes("Top")}
                  onChange={handleInputChange}
                />
                Top
              </label>
              <label>
                <input
                  type="checkbox"
                  name="positions"
                  value="Jungle"
                  checked={formData.positions.includes("Jungle")}
                  onChange={handleInputChange}
                />
                Jungle
              </label>
              <label>
                <input
                  type="checkbox"
                  name="positions"
                  value="Mid"
                  checked={formData.positions.includes("Mid")}
                  onChange={handleInputChange}
                />
                Mid
              </label>
              <label>
                <input
                  type="checkbox"
                  name="positions"
                  value="Bot"
                  checked={formData.positions.includes("Bot")}
                  onChange={handleInputChange}
                />
                Bot
              </label>
              <label>
                <input
                  type="checkbox"
                  name="positions"
                  value="Support"
                  checked={formData.positions.includes("Support")}
                  onChange={handleInputChange}
                />
                Support
              </label>
            </div>
          </div>

          <div className="text-black">
            <label className="text-white">Min Rank:</label>
            <select
              name="minRank"
              value={formData.minRank}
              onChange={handleInputChange}
            >
              <option value="">Select Rank</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Emerald">Emerald</option>
              <option value="Diamond">Diamond</option>
              <option value="Master">Master</option>
              <option value="Grandmaster">Grandmaster</option>
              <option value="Challenger">Challenger</option>
            </select>
            {renderDivisionSelect("minRank")}
          </div>

          <div className="text-black">
            <label className="text-white">Max Rank:</label>
            <select
              name="maxRank"
              value={formData.maxRank}
              onChange={handleInputChange}
            >
              <option value="">Select Rank</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Emerald">Emerald</option>
              <option value="Diamond">Diamond</option>
              <option value="Master">Master</option>
              <option value="Grandmaster">Grandmaster</option>
              <option value="Challenger">Challenger</option>
            </select>
            {renderDivisionSelect("maxRank")}
          </div>

          <div>
            <label>Languages:</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value="English"
                  checked={formData.languages.includes("English")}
                  onChange={handleInputChange}
                />
                English
              </label>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value="Polish"
                  checked={formData.languages.includes("Polish")}
                  onChange={handleInputChange}
                />
                Polish
              </label>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value="Spanish"
                  checked={formData.languages.includes("Spanish")}
                  onChange={handleInputChange}
                />
                Spanish
              </label>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value="French"
                  checked={formData.languages.includes("French")}
                  onChange={handleInputChange}
                />
                French
              </label>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value="German"
                  checked={formData.languages.includes("German")}
                  onChange={handleInputChange}
                />
                German
              </label>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value="Chinese"
                  checked={formData.languages.includes("Chinese")}
                  onChange={handleInputChange}
                />
                Chinese
              </label>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value="Japanese"
                  checked={formData.languages.includes("Japanese")}
                  onChange={handleInputChange}
                />
                Japanese
              </label>
            </div>
          </div>

          <div>
            <label>Champion:</label>
            <Select
              styles={customStyles}
              options={championOptions}
              onChange={handleSelectChange}
              isMulti
            />
          </div>

          <button type="submit" className="px-4 py-2 border-2 border-white">
            Submit{" "}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DuoCreation;
