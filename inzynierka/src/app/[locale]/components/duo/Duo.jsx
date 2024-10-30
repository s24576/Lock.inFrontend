import React, { useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import getMyRiotProfiles from "../../api/riot/getMyRiotProfiles";
import getChampionNames from "../../api/ddragon/getChampionNames";
import createDuo from "../../api/duo/createDuo";
import getDuos from "../../api/duo/getDuos";
import getRiotShortProfiles from "../../api/riot/getRiotShortProfiles";
import { useQuery, useMutation } from "react-query";
import useAxios from "../../hooks/useAxios";
import Select from "react-select";
import Image from "next/image";
import { customStyles } from "@/lib/styles/championNamesList";
import { SearchContext } from "../../context/SearchContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";

const Duo = () => {
  const api = useAxios();

  const pathname = usePathname();
  const router = useRouter();

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const { version } = useContext(SearchContext);

  const {
    data: riotProfiles,
    error,
    isLoading,
  } = useQuery("myRiotProfiles", () => getMyRiotProfiles(api), {
    refetchOnWindowFocus: false,
  });

  const {
    data: championNames,
    error: championNamesError,
    isLoading: championNamesLoading,
  } = useQuery("championNames", () => getChampionNames(), {
    refetchOnWindowFocus: false,
  });

  const {
    data: duos,
    error: duosError,
    isLoading: duosLoading,
  } = useQuery("duos", () => getDuos(language), {
    refetchOnWindowFocus: false,
  });

  const {
    data: riotShortProfiles,
    error: riotShortProfilesError,
    isLoading: riotShortProfilesLoading,
  } = useQuery(
    "riotShortProfiles",
    () => getRiotShortProfiles(duos, language),
    {
      enabled: !!duos, // Włącz zapytanie tylko wtedy, gdy dane duos są dostępne
      refetchOnWindowFocus: false,
    }
  );

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

    // Sprawdzenie, czy któreś z pól jest puste, z wyjątkiem minRankDivision i maxRankDivision dla Master, Grandmaster, Challenger
    const isEmptyField = Object.entries(formData).some(([key, value]) => {
      if (
        (key === "minRankDivision" &&
          ["Master", "Grandmaster", "Challenger"].includes(formData.minRank)) ||
        (key === "maxRankDivision" &&
          ["Master", "Grandmaster", "Challenger"].includes(formData.maxRank))
      ) {
        return false;
      }
      return value === "" || (Array.isArray(value) && value.length === 0);
    });

    if (isEmptyField) {
      console.error("Niektóre pola są puste");
      return;
    }

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
    <div className="pt-[100px] h-screen w-full flex flex-col items-center text-white">
      <p>Duo ogłoszenie</p>
      <p className="pt-2">Konta do wyboru:</p>
      {riotProfiles.map((profile, index) => {
        return (
          <div
            key={index}
            className=" hover:bg-slate-800 cursor-pointer"
            onClick={() =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                puuid: profile.server + "_" + profile.puuid,
              }))
            }
          >
            <p
              className={
                formData.puuid === profile.server + "_" + profile.puuid
                  ? "text-green-500"
                  : ""
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
      <div className="grid grid-cols-4 gap-4 w-[80%]">
        {duos &&
          Array.isArray(riotShortProfiles) &&
          riotShortProfiles.length > 0 &&
          duos.content.map((duo, index) => {
            return (
              <div key={index} className="text-white mt-6">
                {riotShortProfiles.map((profile, index) => {
                  if (profile.puuid === duo.puuid.substring(5)) {
                    return (
                      <div
                        className="flex gap-x-3 items-center hover:bg-[#1a1a1a] cursor-pointer rounded-2xl"
                        key={index}
                        onClick={() => {
                          router.push(
                            `/summoner/${profile.server}/${profile.tagLine}/${profile.gameName}`
                          );
                        }}
                      >
                        <Image
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/" +
                            version +
                            "/img/profileicon/" +
                            profile.profileIconId +
                            ".png"
                          }
                          width={50}
                          height={50}
                          alt="summonerIcon"
                          className="rounded-full border-2 border-white"
                        />
                        <p>{profile.gameName}</p>
                        <p>{profile.summonerLevel} lvl</p>
                      </div>
                    );
                  }
                })}

                <p>{duo.positions}</p>
                <p>
                  {duo.minRank} - {duo.maxRank}
                </p>
                <p>{duo.languages}</p>
                <p>{duo.championIds}</p>
                {duo.saved ? (
                  <FaHeart className="text-[36px]"></FaHeart>
                ) : (
                  <FaRegHeart className="text-[36px]"></FaRegHeart>
                )}
                <IoIosMore
                  className="text-[36px]"
                  onClick={() => {
                    router.push(`/duo/${duo._id}`);
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Duo;
