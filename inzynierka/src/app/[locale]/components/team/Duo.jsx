import React, { useState } from "react";
import getMyRiotProfiles from "../../api/riot/getMyRiotProfiles";
import getChampionNames from "../../api/ddragon/getChampionNames";
import createDuo from "../../api/team/createDuo";
import { useQuery, useMutation } from "react-query";
import useAxios from "../../hooks/useAxios";
import Select from "react-select";
import Image from "next/image";
import { customStyles } from "@/lib/styles/championNamesList";

const Duo = () => {
  const api = useAxios();

  const {
    data: riotProfiles,
    error,
    isLoading,
  } = useQuery("myRiotProfiles", () => getMyRiotProfiles(api));

  const {
    data: championNames,
    error: championNamesError,
    isLoading: championNamesLoading,
  } = useQuery("championNames", () => getChampionNames());

  const [formData, setFormData] = useState({
    puuid: "",
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
              src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${championKey}.png`}
              alt={championValue}
              width={20}
              height={20}
            />
            <span className="ml-2">{championValue}</span>
          </div>
        ),
      }))
    : [];

  const { mutateAsync } = useMutation((formData) => createDuo(api, formData), {
    onSuccess: (data) => {
      console.log("Duo created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating duo:", error);
    },
  });

  const handleSubmit = async () => {
    console.log(formData);
    try {
      await mutateAsync(formData);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading || championNamesLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-white">
      <p>Duo ogłoszenie</p>
      {riotProfiles.map((profile, index) => {
        return (
          <div
            key={index}
            className="py-1 hover:bg-slate-800 cursor-pointer"
            onClick={() =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                puuid: profile.puuid,
              }))
            }
          >
            <p
              className={
                formData.puuid === profile.puuid ? "text-green-500" : ""
              }
            >
              {profile.puuid}
            </p>
          </div>
        );
      })}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
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
    </div>
  );
};

export default Duo;
