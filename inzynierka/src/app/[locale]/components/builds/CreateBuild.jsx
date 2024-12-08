"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import Image from "next/image";
import Select from "react-select";
import { usePathname } from "next/navigation";
import { useQuery } from "react-query";
import getRunes from "../../api/ddragon/getRunes";

const statShardsArray = {
  firstRow: ["Adaptive", "Attack Speed", "Ability Haste"],
  secondRow: ["Adaptive 2", "Movement Speed", "Bonus Health"],
  thirdRow: ["Base Health", "Tenacity", "Bonus Health 2"],
};

const CreateBuild = () => {
  const { userData, isLogged } = useContext(UserContext);
  const [championNames, setChampionNames] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [chosenItems, setChosenItems] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //rune tree selection
  const [runeTree, setRuneTree] = useState(0);

  const [runeTreeSecondary, setRuneTreeSecondary] = useState(0);

  //rune selection
  const [primaryRunes, setPrimaryRunes] = useState(["", "", "", ""]);

  const [secondaryRunes, setSecondaryRunes] = useState(["", ""]);

  const [statShards, setStatShards] = useState(["", "", ""]);

  const [formValues, setFormValues] = useState({
    champion: "",
    title: "",
    description: "",
  });

  const api = useAxios();
  const pathname = usePathname();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/ddragon/getFinalItems"
        );
        setAllItems(response.data);

        const uniqueTags = new Set();
        response.data.forEach((item) => {
          item.tags.forEach((tag) => {
            uniqueTags.add(tag);
          });
        });

        setAllTags([...uniqueTags]);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchChampionNames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/ddragon/getChampionNames"
        );
        const sortedChampionNames = Object.entries(response.data).sort(
          ([, a], [, b]) => a.localeCompare(b)
        );

        setChampionNames(Object.fromEntries(sortedChampionNames));
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
    fetchChampionNames();
  }, []);

  const addItem = (id) => {
    const isAlreadyChosen = chosenItems.some((item) => item.id === id);
    if (isAlreadyChosen) {
      setChosenItems((prevChosenItems) =>
        prevChosenItems.filter((item) => item.id !== id)
      );
    } else if (chosenItems.length < 6) {
      const selectedItem = allItems.find((item) => item.id === id);
      if (selectedItem) {
        setChosenItems((prevChosenItems) => [...prevChosenItems, selectedItem]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSetPrimaryRunes = (newId, index) => {
    setPrimaryRunes((prevRunes) => {
      const updatedRunes = [...prevRunes]; // Tworzymy kopię tablicy
      updatedRunes[index] = newId; // Ustawiamy nową wartość na danym indeksie
      return updatedRunes; // Zwracamy zaktualizowaną tablicę
    });
  };

  const handleSetSecondaryRunes = (newId, index) => {
    setSecondaryRunes((prevRunes) => {
      const updatedRunes = [...prevRunes]; // Tworzymy kopię tablicy

      if (index === 0) {
        // Ustawiamy runę na pierwszą pozycję
        updatedRunes[0] = newId;
      } else if (index === 1) {
        // Ustawiamy runę na drugą pozycję
        updatedRunes[1] = newId;
      } else if (index === 2) {
        // Jeśli oba miejsca są już zajęte
        if (updatedRunes[0] && updatedRunes[1]) {
          // Przesuwamy runę w lewo, usuwając najstarszy wybór (pierwszy wybór)
          updatedRunes[0] = newId; // Nowy wybór wchodzi na pierwsze miejsce
        } else if (updatedRunes[0]) {
          // Jeśli tylko pierwsze miejsce jest zajęte, to nowe ustawienie trafia na drugie miejsce
          updatedRunes[1] = newId;
        } else {
          // Jeśli tylko drugie miejsce jest puste, pierwsze miejsce zostaje zastąpione
          updatedRunes[0] = newId;
        }
      }

      return updatedRunes; // Zwracamy zaktualizowaną tablicę run
    });
  };

  const handleSetStatShards = (shard, index) => {
    setStatShards((prevShards) => {
      const updatedShards = [...prevShards]; // Tworzymy kopię tablicy
      updatedShards[index] = shard; // Ustawiamy nową wartość na danym indeksie
      return updatedShards; // Zwracamy zaktualizowaną tablicę
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const chosenItemsIds = chosenItems.map((item) => item.id);

    console.log("siema");

    try {
      const response = await api.post("/build/createBuild", {
        championId: formValues.champion,
        title: formValues.title,
        description: formValues.description,
        item1: chosenItemsIds[0],
        item2: chosenItemsIds[1],
        item3: chosenItemsIds[2],
        item4: chosenItemsIds[3],
        item5: chosenItemsIds[4],
        item6: chosenItemsIds[5],
        runes: {
          keyStone1Id: runesData[runeTree].id,
          runes1: primaryRunes,
          keyStone2Id: runesData[runeTreeSecondary].id,
          runes2: secondaryRunes,
          statShards: statShards,
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = allItems.filter((item) => {
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => item.tags.includes(tag))
        : true;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  const championOptions = Object.entries(championNames).map(
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#2a2a2a", // Color of the select control
      borderColor: "#555", // Border color of the select control
      color: "#fff", // Text color inside the select control
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2a2a2a", // Color of the dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#555" : "#2a2a2a", // Color of selected and non-selected options
      color: "#fff", // Text color of options
      "&:hover": {
        backgroundColor: "#555", // Background color on hover
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff", // Color of the selected option text
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div className="w-full min-h-screen flex-col items-center">
      <div className=" flex justify-center text-white">
        <div className="flex flex-col mt-[115px] w-[20%] items-end">
          <p className="text-[24px]">Filtry</p>
          <div className="flex flex-col">
            <button
              onClick={() => setSelectedTags([])}
              className={`m-1 border ${
                selectedTags.length === 0 ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              Wszystkie
            </button>
            {allTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag)}
                className={`m-1 border ${
                  selectedTags.includes(tag) ? "bg-blue-500" : "bg-gray-500"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-[115px] w-[50%] relative">
          <div className="relative w-full text-black">
            <input
              type="text"
              className="px-3 py-1 w-full"
              placeholder="Type"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className="absolute right-0 top-0 h-full flex items-center pr-3"
                onClick={handleClearSearch}
              >
                X
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
            {Array.isArray(filteredItems) && filteredItems.length > 0 ? (
              filteredItems.slice(0, 24).map((item, key) => {
                const isChosen = chosenItems.some(
                  (chosenItem) => chosenItem.id === item.id
                );

                return (
                  <div
                    className={`flex flex-col items-center p-4 border rounded cursor-pointer select-none ${
                      isChosen ? "bg-green-300 bg-opacity-40" : ""
                    }`}
                    key={key}
                    onClick={() => addItem(item.id)}
                  >
                    <p>{key}</p>
                    <p>{item.name}</p>
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                        item.id +
                        ".png"
                      }
                      height={25}
                      width={25}
                      alt={item.name}
                    />
                  </div>
                );
              })
            ) : (
              <p>No items</p>
            )}
          </div>
        </div>
        <div className="mt-[115px] flex flex-col w-[30%] items-center">
          <p>Chosen items</p>
          <div className="flex">
            {Array.isArray(chosenItems) && chosenItems.length > 0 ? (
              chosenItems.map((item, index) => (
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${item.id}.png`}
                  height={25}
                  width={25}
                  key={index}
                  alt={item.name}
                />
              ))
            ) : (
              <p>No items chosen</p>
            )}
          </div>
          <form className="flex flex-col gap-y-3 text-black">
            <Select
              styles={customStyles}
              options={championOptions}
              onChange={(selectedOption) =>
                setFormValues((prevValues) => ({
                  ...prevValues,
                  champion: selectedOption.value,
                }))
              }
            />

            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              className="px-3 py-1"
              placeholder="Title"
            />
            <input
              type="text"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              className="px-3 py-1"
              placeholder="Description"
            />

            <button
              className="border-2 border-white cursor-pointer"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="flex justify-center gap-x-12">
        <div className="flex flex-col items-center gap-y-4">
          <p>Primary Runes</p>
          <div className="flex gap-x-2">
            {runesData &&
              runesData.map((rune, key) => {
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setRuneTree(key);
                    }}
                    className="flex flex-col items-center"
                  >
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                      alt={"test"}
                      width={40}
                      height={40}
                    />
                    {runeTree === key ? <p>{rune.name}</p> : null}
                    {runeTree === key ? (
                      <div className="flex flex-col gap-y-4 items-center">
                        {rune.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex gap-x-3">
                            {slot.runes.map((rune, runeIndex) => (
                              <div
                                key={runeIndex}
                                onClick={() =>
                                  handleSetPrimaryRunes(rune.id, slotIndex)
                                }
                              >
                                <Image
                                  src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                  alt={rune.name}
                                  width={40}
                                  height={40}
                                  className={
                                    primaryRunes.includes(rune.id)
                                      ? "opacity-100"
                                      : "opacity-40"
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                        <button onClick={() => console.log(primaryRunes)}>
                          click
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-4">
          <p>Secondary Runes</p>
          <div className="flex gap-x-2">
            {runesData &&
              runesData.map((rune, key) => {
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setRuneTreeSecondary(key);
                    }}
                    className="flex flex-col items-center"
                  >
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                      alt={"test"}
                      width={40}
                      height={40}
                    />
                    {runeTree === key ? <p>{rune.name}</p> : null}
                    {runeTreeSecondary === key ? (
                      <div className="flex flex-col gap-y-4 items-center">
                        {rune.slots
                          .filter((_, slotIndex) => slotIndex !== 0)
                          .map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex gap-x-3">
                              {slot.runes.map((rune, runeIndex) => (
                                <div
                                  key={runeIndex}
                                  onClick={() =>
                                    handleSetSecondaryRunes(rune.id, slotIndex)
                                  }
                                >
                                  <Image
                                    src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                    alt={rune.name}
                                    width={40}
                                    height={40}
                                    className={
                                      secondaryRunes.includes(rune.id)
                                        ? "opacity-100"
                                        : "opacity-40"
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        <button onClick={() => console.log(secondaryRunes)}>
                          click
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex flex-col gap-y-2 ">
          <div className="flex gap-x-4">
            {statShardsArray.firstRow.map((shard, key) => {
              return (
                <p
                  key={key}
                  onClick={() => handleSetStatShards(shard, 0)}
                  className={
                    statShards.includes(shard) ? "text-green-500" : "text-white"
                  }
                >
                  {shard}
                </p>
              );
            })}
          </div>

          <div className="flex gap-x-4">
            {statShardsArray.secondRow.map((shard, key) => {
              return (
                <p
                  key={key}
                  onClick={() => handleSetStatShards(shard, 1)}
                  className={
                    statShards.includes(shard) ? "text-green-500" : "text-white"
                  }
                >
                  {shard}
                </p>
              );
            })}
          </div>
          <div className="flex gap-x-4">
            {statShardsArray.thirdRow.map((shard, key) => {
              return (
                <p
                  key={key}
                  onClick={() => handleSetStatShards(shard, 2)}
                  className={
                    statShards.includes(shard) ? "text-green-500" : "text-white"
                  }
                >
                  {shard}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBuild;
