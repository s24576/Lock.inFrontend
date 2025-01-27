"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import getChampionNames from "../../api/ddragon/getChampionNames";
import LeaguePosition from "../other/LeaguePosition";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useQuery, useMutation } from "react-query";
import getRunes from "../../api/ddragon/getRunes";
import { IoChevronForward } from "react-icons/io5";
import getFinalItems from "../../api/ddragon/getFinalItems";
import createBuild from "../../api/builds/createBuild";
import { useTranslation } from "react-i18next";

const statShardsArray = {
  firstRow: ["Adaptive", "Attack Speed", "Ability Haste"],
  secondRow: ["Adaptive 2", "Movement Speed", "Bonus Health"],
  thirdRow: ["Base Health", "Tenacity", "Bonus Health 2"],
};

const summoners = [
  "Barrier",
  "Boost",
  "Exhaust",
  "Flash",
  "Haste",
  "Heal",
  "Dot",
  "Smite",
  "Teleport",
];

const runeShards = [
  "Adaptive",
  "AttackSpeed",
  "CDR",
  "Adaptive",
  "MS",
  "HPScaling",
  "HP",
  "Tenacity",
  "HPScaling",
];

const CreateBuild = () => {
  const { userData, isLogged } = useContext(UserContext);
  const { version } = useContext(SearchContext);
  const [titlePlaceholder, setTitlePlaceholder] = useState("");
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState("");
  const [championOptions, setChampionOptions] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [chosenItems, setChosenItems] = useState(["", "", "", "", "", ""]);
  const [itemSearch, setItemSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [navigation, setNavigation] = useState(0);

  const { t } = useTranslation();
  //rune tree selection
  const [runeTree, setRuneTree] = useState(0);

  const [runeTreeSecondary, setRuneTreeSecondary] = useState(1);

  //rune selection
  const [primaryRunes, setPrimaryRunes] = useState([
    { id: "", icon: "" },
    { id: "", icon: "" },
    { id: "", icon: "" },
    { id: "", icon: "" },
  ]);

  const [secondaryRunes, setSecondaryRunes] = useState([
    { id: "", icon: "" },
    { id: "", icon: "" },
  ]);

  const [selectedShards, setSelectedShards] = useState(["", "", ""]);

  const [formValues, setFormValues] = useState({
    title: t("builds:newBuild"),
    description: t("builds:newDescription"),
    champion: "",
    championKey: "",
    position: "",
    summoner1Name: "",
    summoner2Name: "",
  });

  const axiosInstance = useAxios();
  const router = useRouter();

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
  });

  const [searchChampion, setSearchChampion] = useState("");

  const handleChampionSearch = (e) => {
    setSearchChampion(e.target.value); // Przechowuj dokładnie to, co wpisuje użytkownik
  };

  const filteredChampionOptions = Object.entries(
    championNamesData || {}
  ).filter(
    ([, championValue]) =>
      championValue.toLowerCase().includes(searchChampion.toLowerCase()) // Porównuj w lowercase
  );

  const handleSummonerClick = (summoner) => {
    if (!formValues.summoner1Name) {
      // If summoner 1 is not set, set summoner 1
      setFormValues({
        ...formValues,
        summoner1Name: summoner,
      });
    } else if (!formValues.summoner2Name) {
      // If summoner 2 is not set, set summoner 2
      setFormValues({
        ...formValues,
        summoner2Name: summoner,
      });
    }
  };

  const handleSummonerRemove = (summoner) => {
    if (formValues.summoner1Name === summoner) {
      // If summoner 1 is removed, make summoner 2 the first
      setFormValues({
        ...formValues,
        summoner1Name: formValues.summoner2Name,
        summoner2Name: "",
      });
    } else if (formValues.summoner2Name === summoner) {
      // If summoner 2 is removed, clear summoner 2 slot
      setFormValues({
        ...formValues,
        summoner2Name: "",
      });
    }
  };

  const handleSetRuneTree = (key) => {
    setRuneTree(key);
    // Zaktualizuj runeTreeSecondary, aby zawsze było inne niż runeTree
    if (key === 0) {
      setRuneTreeSecondary(1); // Jeżeli wybrano drzewko o indeksie 0, ustaw runeTreeSecondary na 1
    } else {
      setRuneTreeSecondary(0); // Jeżeli wybrano inne drzewko, ustaw runeTreeSecondary na 0
    }
  };

  const handleSetRuneTreeSecondary = (key) => {
    // Upewnij się, że drugie drzewko nie jest takie samo jak pierwsze
    if (key !== runeTree) {
      setRuneTreeSecondary(key);
    }
  };

  const handleSetPrimaryRunes = (newId, newIcon, index) => {
    setPrimaryRunes((prevRunes) => {
      const updatedRunes = [...prevRunes]; // Tworzymy kopię tablicy
      updatedRunes[index] = { id: newId, icon: newIcon }; // Ustawiamy obiekt {id, icon} na danym indeksie
      return updatedRunes; // Zwracamy zaktualizowaną tablicę
    });
  };

  const handleSetSecondaryRunes = (newId, newIcon, index) => {
    setSecondaryRunes((prevRunes) => {
      const updatedRunes = [...prevRunes]; // Tworzymy kopię tablicy

      if (index === 0) {
        // Ustawiamy runę na pierwszą pozycję
        updatedRunes[0] = { id: newId, icon: newIcon };
      } else if (index === 1) {
        // Ustawiamy runę na drugą pozycję
        updatedRunes[1] = { id: newId, icon: newIcon };
      } else if (index === 2) {
        // Jeśli oba miejsca są już zajęte
        if (updatedRunes[0] && updatedRunes[1]) {
          // Przesuwamy runę w lewo, usuwając najstarszy wybór (pierwszy wybór)
          updatedRunes[0] = { id: newId, icon: newIcon }; // Nowy wybór wchodzi na pierwsze miejsce
        } else if (updatedRunes[0]) {
          // Jeśli tylko pierwsze miejsce jest zajęte, to nowe ustawienie trafia na drugie miejsce
          updatedRunes[1] = { id: newId, icon: newIcon };
        } else {
          // Jeśli tylko drugie miejsce jest puste, pierwsze miejsce zostaje zastąpione
          updatedRunes[0] = { id: newId, icon: newIcon };
        }
      }

      return updatedRunes; // Zwracamy zaktualizowaną tablicę run
    });
  };

  const handleShardSelection = (row, shard) => {
    const newSelectedShards = [...selectedShards];
    newSelectedShards[row] = shard;
    setSelectedShards(newSelectedShards);
  };

  useEffect(() => {
    setPrimaryRunes(["", "", "", ""]);
  }, [runeTree]);

  useEffect(() => {
    setSecondaryRunes(["", ""]);
  }, [runeTreeSecondary]);

  const {
    data: runesData,
    error: runesError,
    isLoading: runesIsLoading,
  } = useQuery("runesData", () => getRunes(), {
    refetchOnWindowFocus: false,
  });

  const {
    data: itemsData,
    error: itemsError,
    isLoading: itemsIsLoading,
  } = useQuery("itemsData", () => getFinalItems(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  const handleSetSelectedTags = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handleAddItem = (itemId) => {
    setChosenItems((prevItems) => {
      // Jeśli itemId już istnieje w tablicy, nie dodawaj go ponownie
      if (prevItems.includes(itemId)) {
        return prevItems;
      }

      const index = prevItems.findIndex((id) => id === ""); // Znajdujemy pierwsze wolne miejsce
      if (index !== -1) {
        const newItems = [...prevItems];
        newItems[index] = itemId;
        return newItems;
      }

      return prevItems; // Jeśli brak miejsca, zwracamy poprzednią tablicę
    });
  };

  const handleDeleteItem = (index) => {
    setChosenItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1); // Usuwamy element na wskazanym indeksie
      newItems.push(""); // Dodajemy puste miejsce na koniec
      return newItems;
    });
  };

  const { mutateAsync: handleCreateBuild, isLoading: isCreatingBuild } =
    useMutation((requestBody) => createBuild(axiosInstance, requestBody), {
      onSuccess: (data) => {
        console.log("build created successfully:", data);
        router.push("/builds/" + data);
      },
      onError: (error) => {
        console.error("Error creating course:", error);
      },
    });

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async () => {
    setValidationError("");

    // Sprawdzamy czy tytuł nie jest pusty i nie jest domyślną wartością
    if (!formValues.title || formValues.title === t("builds:newBuild")) {
      setValidationError(t("builds:titleRequired"));
      return;
    }

    // Sprawdzamy czy opis nie jest pusty i nie jest domyślną wartością
    if (
      !formValues.description ||
      formValues.description === t("builds:newDescription")
    ) {
      setValidationError(t("builds:descriptionRequired"));
      return;
    }

    if (!formValues.championKey) {
      setValidationError(t("builds:championRequired"));
      return;
    }
    if (!formValues.position) {
      setValidationError(t("builds:positionRequired"));
      return;
    }
    if (!formValues.summoner1Name || !formValues.summoner2Name) {
      setValidationError(t("builds:summonersRequired"));
      return;
    }
    if (chosenItems.some((item) => item === "")) {
      setValidationError(t("builds:itemsRequired"));
      return;
    }
    if (
      primaryRunes.some((rune) => !rune.id) ||
      secondaryRunes.some((rune) => !rune.id)
    ) {
      setValidationError(t("builds:runesRequired"));
      return;
    }
    if (selectedShards.some((shard) => !shard)) {
      setValidationError(t("builds:shardsRequired"));
      return;
    }

    // Jeśli walidacja przeszła, kontynuujemy z wysyłaniem
    const [item1, item2, item3, item4, item5, item6] = chosenItems;
    const runes1 = primaryRunes.map((rune) => rune.id);
    const runes2 = secondaryRunes.map((rune) => rune.id);
    const statShards = selectedShards;

    const keystoneIds = [
      { id: 8100 },
      { id: 8300 },
      { id: 8000 },
      { id: 8400 },
      { id: 8200 },
    ];

    const keyStone1Id = keystoneIds[runeTree].id;
    const keyStone2Id = keystoneIds[runeTreeSecondary].id;

    const requestBody = {
      championId: formValues.championKey,
      item1,
      item2,
      item3,
      item4,
      item5,
      item6,
      position: formValues.position,
      runes: {
        keyStone1Id,
        runes1,
        keyStone2Id,
        runes2,
        statShards,
      },
      summoner1Name: formValues.summoner1Name,
      summoner2Name: formValues.summoner2Name,
      title: formValues.title,
      description: formValues.description,
    };

    await handleCreateBuild(requestBody);
  };

  const itemTags = [
    {
      tag: "Health",
      name: t("builds:hp"),
    },
    {
      tag: "Damage",
      name: t("builds:dmg"),
    },
    {
      tag: "CooldownReduction",
      name: t("builds:cdr"),
    },
    {
      tag: "ArmorPenetration",
      name: t("builds:armorPen"),
    },
    {
      tag: "LifeSteal",
      name: t("builds:lifesteal"),
    },
    {
      tag: "OnHit",
      name: t("builds:onHit"),
    },
    {
      tag: "Armor",
      name: t("builds:armor"),
    },
    {
      tag: "AttackSpeed",
      name: t("builds:as"),
    },
    {
      tag: "NonbootsMovement",
      name: t("builds:ms"),
    },
    {
      tag: "MagicResist",
      name: t("builds:mr"),
    },
    {
      tag: "Boots",
      name: t("builds:boots"),
    },
    {
      tag: "Mana",
      name: t("builds:mana"),
    },
  ];

  if (
    championNamesIsLoading ||
    runesIsLoading ||
    itemsIsLoading ||
    isLogged === null
  ) {
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

  if (
    isLogged &&
    !championNamesIsLoading &&
    !runesIsLoading &&
    !itemsIsLoading
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center relative px-[5%] font-dekko">
        <div
          className="absolute inset-0 bg-cover bg-fixed"
          style={{
            backgroundImage: `url('/background-images/createbuild.webp')`,
            opacity: "0.3",
            backgroundSize: "cover", // Nie powiększa obrazu
            backgroundPosition: "center", // Ustawienie środka obrazu
            backgroundRepeat: "no-repeat", // Zapobiega powtarzaniu
            width: "100%",
            height: "100vh", // Obraz będzie rozciągał się na wysokość widoku
          }}
        ></div>
        <div className="mt-[7%] flex items-center gap-x-1 z-20 text-[20px]">
          <p
            onClick={() => setNavigation(0)}
            className={
              navigation === 0
                ? "text-amber"
                : "text-white-smoke hover:text-silver duration-150 transition-all cursor-pointer"
            }
          >
            {t("builds:nav1")}
          </p>
          <IoChevronForward />
          <p
            onClick={() => setNavigation(1)}
            className={
              navigation === 1
                ? "text-amber"
                : "text-white-smoke hover:text-silver duration-150 transition-all cursor-pointer"
            }
          >
            {t("builds:nav2")}
          </p>
          <IoChevronForward />
          <p
            onClick={() => setNavigation(2)}
            className={
              navigation === 2
                ? "text-amber"
                : "text-white-smoke hover:text-silver duration-150 transition-all cursor-pointer"
            }
          >
            {t("builds:nav3")}
          </p>
          <IoChevronForward />
          <p
            onClick={() => setNavigation(3)}
            className={
              navigation === 3
                ? "text-amber"
                : "text-white-smoke hover:text-silver duration-150 transition-all cursor-pointer"
            }
          >
            {t("builds:nav4")}
          </p>
        </div>
        <div className="mt-[1%] w-full flex items-center gap-x-8 z-20 bg-night bg-opacity-70 py-4 px-[5%] rounded-xl h-[10vh]">
          <div className="flex flex-col items-center w-[20%] text-amber">
            <p className="text-[24px]">{formValues?.title}</p>
            <p>
              {formValues?.description.length > 50
                ? formValues?.description.slice(0, 50) + "..."
                : formValues?.description}
            </p>
          </div>
          <div className="flex items-center gap-x-4 ml-8">
            {formValues.championKey && (
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${formValues.championKey}.png`}
                alt={formValues.championKey}
                width={56} // Adjust the width as needed
                height={56} // Adjust the height as needed
                key={formValues.championKey}
                className="border-[1px] border-white-smoke rounded-full hover:opacity-70 cursor-pointer transition-all duration-150"
                onClick={() =>
                  setFormValues({
                    ...formValues,
                    champion: "",
                    championKey: "",
                  })
                }
              />
            )}
            {formValues.position && (
              <LeaguePosition height={48} position={formValues.position} />
            )}
          </div>
          {/* runy */}

          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              {primaryRunes &&
                primaryRunes.map((rune, key) => {
                  // Sprawdzamy, czy pole `icon` ma zawartość przed renderowaniem
                  if (!rune.icon) {
                    return null; // Jeśli nie ma `icon`, nie renderujemy tej runy
                  }

                  return (
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                      height={48}
                      width={48}
                      key={key}
                      className="border-[1px] border-white-smoke rounded-full"
                    />
                  );
                })}
            </div>

            <div className="flex flex-col items-center gap-y-2">
              <div className="flex gap-x-2 items-center">
                {secondaryRunes &&
                  secondaryRunes.map((rune, key) => {
                    // Sprawdzamy, czy pole `icon` ma zawartość przed renderowaniem
                    if (!rune.icon) {
                      return null; // Jeśli nie ma `icon`, nie renderujemy tej runy
                    }

                    return (
                      <Image
                        src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                        height={40}
                        width={40}
                        key={key}
                        className="border-[1px] border-white-smoke rounded-full"
                      />
                    );
                  })}
              </div>

              <div className="flex gap-x-2 items-center">
                {selectedShards &&
                  selectedShards.map((shard, key) => {
                    if (!shard) {
                      return null; // Jeśli nie ma sharda, nie renderujemy
                    }

                    return (
                      <Image
                        src={`/rune-shards/${shard}.webp`}
                        height={24}
                        width={24}
                        key={key}
                      />
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            {formValues.summoner1Name && (
              <div className="hover:opacity-50 transition-opacity duration-150 cursor-pointer">
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/" +
                    version +
                    "/img/spell/" +
                    "Summoner" +
                    formValues.summoner1Name +
                    ".png"
                  }
                  width={48}
                  height={48}
                  alt={formValues.summoner1Name}
                  className="object-cover"
                  onClick={() => handleSummonerRemove(formValues.summoner1Name)}
                />
              </div>
            )}
            {formValues.summoner2Name && (
              <div className="hover:opacity-50 transition-opacity duration-150 cursor-pointer">
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/" +
                    version +
                    "/img/spell/" +
                    "Summoner" +
                    formValues.summoner2Name +
                    ".png"
                  }
                  width={48}
                  height={48}
                  alt={formValues.summoner2Name}
                  className="object-cover"
                  onClick={() => handleSummonerRemove(formValues.summoner2Name)}
                />
              </div>
            )}
          </div>

          {/* itemy */}
          <div className="flex items-center gap-x-2">
            {chosenItems?.length > 0 &&
              chosenItems.map((item, key) => {
                // Sprawdzenie, czy item nie jest pustym stringiem
                if (item.trim() === "") return null;

                return (
                  <Image
                    key={key}
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/" +
                      version +
                      "/img/item/" +
                      item +
                      ".png"
                    }
                    onClick={() => handleDeleteItem(key)}
                    alt={item}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full cursor-pointer hover:opacity-70 transition-opacity duration-150 border-[1px] border-white-smoke"
                  />
                );
              })}
          </div>
        </div>
        {navigation === 0 && (
          <div className="w-full flex justify-between mt-[3%] z-20">
            <div className="w-[30%] flex flex-col justify-between">
              <input
                type="text"
                placeholder={t("builds:searchChampion")}
                value={searchChampion}
                onChange={handleChampionSearch}
                className="w-full bg-night bg-opacity-70 rounded-xl p-4 text-[16px] focus:outline-none"
              />
              <div className="w-full flex flex-col gap-y-2 pb-[20%]">
                <p className="text-[28px]">{t("builds:selectPosition")}</p>
                <div className="flex flex-wrap gap-4">
                  {/* toplane */}
                  <div
                    className={`flex gap-x-4 items-center bg-night bg-opacity-80 px-6 py-3 rounded-xl cursor-pointer hover:bg-silver-hover transition-all duration-100 ${
                      formValues.position === "Top"
                        ? "outline outline-[1px] outline-white-smoke"
                        : ""
                    }`}
                    onClick={() =>
                      setFormValues({ ...formValues, position: "Top" })
                    }
                  >
                    <LeaguePosition height={32} position={"Top"} />
                    <p className="text-[20px]">{t("common:top")}</p>
                  </div>
                  {/* jungle */}
                  <div
                    className={`flex gap-x-4 items-center bg-night bg-opacity-80 px-6 py-3 rounded-xl cursor-pointer hover:bg-silver-hover transition-all duration-100 ${
                      formValues.position === "Jungle"
                        ? "outline outline-[1px] outline-white-smoke"
                        : ""
                    }`}
                    onClick={() =>
                      setFormValues({ ...formValues, position: "Jungle" })
                    }
                  >
                    <LeaguePosition height={32} position={"Jungle"} />
                    <p className="text-[20px]">{t("common:jungle")}</p>
                  </div>
                  {/* midlane */}
                  <div
                    className={`flex gap-x-4 items-center bg-night bg-opacity-80 px-6 py-3 rounded-xl cursor-pointer hover:bg-silver-hover transition-all duration-100 ${
                      formValues.position === "Mid"
                        ? "outline outline-[1px] outline-white-smoke"
                        : ""
                    }`}
                    onClick={() =>
                      setFormValues({ ...formValues, position: "Mid" })
                    }
                  >
                    <LeaguePosition height={32} position={"Mid"} />
                    <p className="text-[20px]">{t("common:mid")}</p>
                  </div>
                  {/* bottom */}
                  <div
                    className={`flex gap-x-4 items-center bg-night bg-opacity-80 px-6 py-3 rounded-xl cursor-pointer hover:bg-silver-hover transition-all duration-100 ${
                      formValues.position === "Bottom"
                        ? "outline outline-[1px] outline-white-smoke"
                        : ""
                    }`}
                    onClick={() =>
                      setFormValues({ ...formValues, position: "Bottom" })
                    }
                  >
                    <LeaguePosition height={32} position={"Bottom"} />
                    <p className="text-[20px]">{t("common:bot")}</p>
                  </div>
                  {/* support */}
                  <div
                    className={`flex gap-x-4 items-center bg-night bg-opacity-80 px-6 py-3 rounded-xl cursor-pointer hover:bg-silver-hover transition-all duration-100 ${
                      formValues.position === "Support"
                        ? "outline outline-[1px] outline-white-smoke"
                        : ""
                    }`}
                    onClick={() =>
                      setFormValues({ ...formValues, position: "Support" })
                    }
                  >
                    <LeaguePosition height={32} position={"Support"} />
                    <p className="text-[20px]">{t("common:support")}</p>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center hover:text-amber duration-150 transition-all cursor-pointer pb-[5%]"
                onClick={() => setNavigation(1)}
              >
                <p className="text-[28px]">{t("builds:nextPage")}</p>
                <IoChevronForward className="text-[28px]" />
              </div>
            </div>
            <div className="w-[65%] flex flex-wrap gap-2">
              {championNamesData &&
                filteredChampionOptions.map(([championKey, championValue]) => {
                  return (
                    <div
                      key={championKey}
                      className={`w-[50px] h-[50px] border-[1px] border-white-smoke hover:opacity-100 cursor-pointer transition-all duration-150 flex items-center justify-center ${
                        formValues.championKey
                          ? formValues.championKey === championKey
                            ? "opacity-100"
                            : "opacity-50"
                          : "opacity-100"
                      }`}
                      onClick={() =>
                        setFormValues({
                          ...formValues,
                          champion: championValue,
                          championKey,
                        })
                      }
                    >
                      <Image
                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championKey}.png`}
                        alt={championValue}
                        width={50}
                        height={50}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {navigation === 1 && (
          <div className="w-full flex justify-between mt-[3%] z-20">
            <div className="w-[30%] flex flex-col justify-between">
              <div className="flex flex-col gap-y-2 w-full">
                <p className="text-[28px]">{t("builds:selectSumms")}</p>
                <div className="flex flex-wrap gap-4">
                  {summoners.map((summoner) => {
                    return (
                      <div
                        key={summoner}
                        className={`transition-opacity duration-150 cursor-pointer ${
                          formValues.summoner1Name === summoner ||
                          formValues.summoner2Name === summoner
                            ? "outline-[1px] outline-white-smoke"
                            : "hover:opacity-50"
                        }`}
                        onClick={() => handleSummonerClick(summoner)}
                      >
                        <Image
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/" +
                            version +
                            "/img/spell/" +
                            "Summoner" +
                            summoner +
                            ".png"
                          }
                          width={56}
                          height={56}
                          alt={summoner}
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className="flex items-center hover:text-amber duration-150 transition-all cursor-pointer pb-[5%]"
                onClick={() => setNavigation(2)}
              >
                <p className="text-[28px]">{t("builds:nextPage")}</p>
                <IoChevronForward className="text-[28px]" />
              </div>
            </div>
            <div className="w-[65%] flex gap-2">
              {runesData && (
                <div className="w-[50%] flex flex-col gap-x-2">
                  <div className="flex gap-x-2 items-center">
                    {runesData.map((rune, key) => (
                      <div
                        key={key}
                        className={`bg-night bg-opacity-80 rounded-full border-[1px] border-white-smoke p-[10px] cursor-pointer hover:bg-silver hover:bg-opacity-35 transition-all duration-150 
                        ${runeTree === key ? "bg-silver bg-opacity-35" : ""}`}
                        onClick={() => handleSetRuneTree(key)}
                      >
                        <Image
                          src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                          alt={rune.name} // You can use rune.name instead of a static "test"
                          width={48}
                          height={48}
                          className=""
                        />
                      </div>
                    ))}
                  </div>
                  {/* Handle different rune trees */}
                  {runesData.map((rune, key) => {
                    return runeTree === key ? (
                      <div className="mt-[8%] flex flex-col gap-y-2" key={key}>
                        {rune.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex gap-x-2">
                            {slot.runes.map((rune, runeIndex) => (
                              <div
                                key={runeIndex}
                                className={`bg-night bg-opacity-80 rounded-full border-[1px] border-white-smoke cursor-pointer hover:bg-silver hover:bg-opacity-35 transition-all duration-150
                                ${slotIndex === 0 ? "p-[5px]" : ""}`}
                                onClick={() =>
                                  handleSetPrimaryRunes(
                                    rune.id,
                                    rune.icon,
                                    slotIndex
                                  )
                                }
                              >
                                <Image
                                  src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                  alt={rune.name}
                                  width={slotIndex === 0 ? 48 + 10 : 48 + 20} // Adjust size based on slotIndex
                                  height={slotIndex === 0 ? 48 + 10 : 48 + 20} // Adjust size based on slotIndex
                                  className={
                                    primaryRunes.some((r) => r.id === rune.id)
                                      ? "opacity-100"
                                      : "opacity-50"
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              <div className="w-[50%] flex flex-col">
                {runesData && (
                  <div className="w-full flex flex-col gap-x-2">
                    <div className="flex gap-x-2 items-center">
                      {runesData.map((rune, key) => (
                        <div
                          key={key}
                          className={`bg-night bg-opacity-80 rounded-full border-[1px] border-white-smoke p-[10px] cursor-pointer hover:bg-silver hover:bg-opacity-35 transition-all duration-150 
                        ${
                          runeTreeSecondary === key
                            ? "bg-silver bg-opacity-35"
                            : ""
                        }
                        ${
                          runeTree === key
                            ? "cursor-auto opacity-50 hover:bg-night hover:bg-opacity-80"
                            : ""
                        }`} // Dodanie logiki blokującej dla tego samego drzewa
                          onClick={() => {
                            if (runeTree !== key) {
                              // Tylko wtedy, gdy runeTree nie jest równe key
                              handleSetRuneTreeSecondary(key);
                            }
                          }}
                        >
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                            alt={rune.name} // You can use rune.name instead of a static "test"
                            width={48}
                            height={48}
                            className=""
                          />
                        </div>
                      ))}
                    </div>
                    {/* Handle different rune trees */}
                    {runesData.map((rune, key) => {
                      return runeTreeSecondary === key ? (
                        <div
                          className="mt-[8%] flex flex-col gap-y-2"
                          key={key}
                        >
                          {rune.slots
                            .filter((_, slotIndex) => slotIndex !== 0)
                            .map((slot, slotIndex) => (
                              <div key={slotIndex} className="flex gap-x-2">
                                {slot.runes.map((rune, runeIndex) => (
                                  <div
                                    key={runeIndex}
                                    className={`bg-night bg-opacity-80 rounded-full border-[1px] border-white-smoke cursor-pointer hover:bg-silver hover:bg-opacity-35 transition-all duration-150
                                ${slotIndex === 0 ? "p-[5px]" : ""}`}
                                    onClick={() =>
                                      handleSetSecondaryRunes(
                                        rune.id,
                                        rune.icon,
                                        slotIndex
                                      )
                                    }
                                  >
                                    <Image
                                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                      alt={rune.name}
                                      width={
                                        slotIndex === 0 ? 48 + 10 : 48 + 20
                                      } // Adjust size based on slotIndex
                                      height={
                                        slotIndex === 0 ? 48 + 10 : 48 + 20
                                      } // Adjust size based on slotIndex
                                      className={
                                        secondaryRunes.some(
                                          (r) => r.id === rune.id
                                        )
                                          ? "opacity-100"
                                          : "opacity-50"
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      ) : null;
                    })}
                    <div className="mt-[3%] flex flex-col"></div>
                  </div>
                )}

                <div className="mt-[3%] grid grid-cols-3 gap-1 w-[30%] ml-[18px]">
                  {runeShards.map((shard, key) => {
                    const row = Math.floor(key / 3); // Określenie wiersza
                    const isSelected = selectedShards[row] === shard; // Sprawdzanie, czy shard jest wybrany w danym wierszu

                    return (
                      <div
                        key={key}
                        onClick={() => handleShardSelection(row, shard)} // Obsługuje kliknięcie na shard
                        className={`cursor-pointer ${
                          isSelected ? "opacity-100" : "opacity-60"
                        }`}
                      >
                        <Image
                          src={`/rune-shards/${shard}.webp`} // Zakładając, że masz odpowiednią ścieżkę do obrazków
                          alt={shard}
                          width={32}
                          height={32}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {navigation === 2 && (
          <div className="w-full flex justify-between mt-[3%] z-20">
            <div className="w-[30%] flex flex-col justify-between">
              <input
                type="text"
                placeholder={t("builds:searchItem")}
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="w-full bg-night bg-opacity-70 rounded-xl p-4 text-[16px] focus:outline-none"
              />
              <p className="text-[28px] mt-[7%]">{t("builds:filterByTags")}</p>
              <div className="flex flex-wrap gap-4 mt-[3%]">
                {itemTags.map((item, key) => {
                  return (
                    <div
                      key={key}
                      onClick={() => handleSetSelectedTags(item.tag)}
                      className={`bg-night bg-opacity-70 text-[18px] text-opacity-80 px-7 py-2 rounded-xl hover:bg-silver hover:bg-opacity-30 transition-all duration-150 cursor-pointer
                      ${
                        selectedTags.includes(item.tag)
                          ? "outline outline-1 outline-white-smoke"
                          : ""
                      }`}
                    >
                      <p>{item.name}</p>
                    </div>
                  );
                })}
              </div>
              <div
                className="flex items-center hover:text-amber duration-150 transition-all cursor-pointer mt-[8%]"
                onClick={() => setNavigation(3)}
              >
                <p className="text-[28px]">Next page</p>
                <IoChevronForward className="text-[28px]" />
              </div>
            </div>

            <div className="w-[65%] flex flex-wrap items-start gap-2 max-h-[20vh]">
              {itemsData &&
                itemsData
                  .filter((item) => {
                    const matchesSearch =
                      itemSearch === "" ||
                      item.name
                        .toLowerCase()
                        .includes(itemSearch.toLowerCase());
                    const matchesTags =
                      selectedTags.length === 0 ||
                      item.tags.some((tag) => selectedTags.includes(tag));
                    return matchesSearch && matchesTags; // Przedmiot musi spełniać oba warunki
                  })
                  .map((item, key) => {
                    // Sprawdzamy, czy wszystkie elementy w chosenItems są pełne (nie są pustymi ciągami)
                    const isFull =
                      chosenItems.filter((id) => id !== "").length === 6;
                    const isItemChosen = chosenItems.includes(item.id);

                    // Określamy opacity na podstawie warunków
                    let itemOpacity = "opacity-80 "; // Domyślna opacity 80% dla nieklikniętych i niewybranych przedmiotów

                    if (isItemChosen) {
                      itemOpacity = "opacity-100 border-amber border-[1.5px]"; // Zawsze opacity 100% dla klikniętego przedmiotu
                    } else if (isFull) {
                      itemOpacity = "opacity-30 "; // Opacity 50% dla nieklikniętych, gdy wszystkie przedmioty zostały wybrane
                    }

                    return (
                      <div
                        key={key}
                        className={`w-[50px] h-[50px] flex-shrink-0  cursor-pointer transition-all duration-150 flex items-center justify-center ${itemOpacity}`}
                        onClick={() => handleAddItem(item.id)}
                      >
                        <Image
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/" +
                            version +
                            "/img/item/" +
                            item.id +
                            ".png"
                          }
                          alt={item.name}
                          width={50}
                          height={50}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
        {navigation === 3 && (
          <div className="w-full flex flex-col items-center gap-y-4 z-20">
            <input
              type="text"
              value={titlePlaceholder}
              onChange={(e) => {
                const value = e.target.value;
                setTitlePlaceholder(value);
                setFormValues((prevValues) => ({
                  ...prevValues,
                  title: value,
                }));
              }}
              placeholder={t("builds:title")}
              className="w-[30%] bg-night bg-opacity-70 rounded-xl text-[24px] px-6 py-3 mt-[4%] focus:outline-none"
            />
            <textarea
              rows={6}
              value={descriptionPlaceholder}
              onChange={(e) => {
                const value = e.target.value;
                setDescriptionPlaceholder(value);
                setFormValues((prevValues) => ({
                  ...prevValues,
                  description: value,
                }));
              }}
              className="w-[30%] bg-night bg-opacity-70 rounded-xl text-[24px] px-6 py-3 mt-[1%] focus:outline-none"
              placeholder={t("builds:description")}
            ></textarea>
            {validationError && (
              <p className="text-amber text-[24px] text-center">
                {validationError}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={isCreatingBuild}
              className="w-[15%] text-[20px] bg-night bg-opacity-70 py-2 border-[1px] border-white-smoke rounded-3xl hover:bg-silver hover:bg-opacity-15 transition-all duration-150 flex items-center justify-center gap-x-2"
            >
              {isCreatingBuild ? (
                <AiOutlineLoading3Quarters className="animate-spin text-[24px]" />
              ) : (
                t("builds:createBuild")
              )}
            </button>
          </div>
        )}
      </div>
    );
  }
};

export default CreateBuild;
