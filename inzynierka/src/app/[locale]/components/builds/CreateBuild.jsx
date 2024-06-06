"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Image from "next/image";

//najpierw robione jako creator
const CreateBuild = () => {
  const { userData } = useContext(UserContext);

  const [allItems, setAllItems] = useState([]);
  const [chosenItems, setChosenItems] = useState([]);
  const [formValues, setFormValues] = useState({
    champion: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/ddragon/getFinalItems"
        );
        console.log(response.data);
        setAllItems(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, []);

  const addItem = (id) => {
    const isAlreadyChosen = chosenItems.some((item) => item.id === id);
    if (isAlreadyChosen) {
      const updatedChosenItems = chosenItems.filter((item) => item.id !== id);
      setChosenItems(updatedChosenItems);
    } else {
      if (chosenItems.length !== 6) {
        const selectedItem = allItems.find((item) => item.id === id);
        if (selectedItem) {
          setChosenItems((prevChosenItems) => [
            ...prevChosenItems,
            selectedItem,
          ]);
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formValues);
    console.log(chosenItems);

    const chosenItemsIds = chosenItems.map((item) => item.id);
    console.log(chosenItemsIds);

    try {
      const response = await axios.post(
        "http://localhost:8080/build/createBuild",
        {
          championName: formValues.champion,
          title: formValues.title,
          description: formValues.description,
          items: chosenItemsIds,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center text-white">
      <div className="flex flex-col mt-[115px]">
        <p>Filtry</p>
        <p>AD</p>
        <p>AP</p>
      </div>
      <div className="flex flex-col mt-[115px]">
        <input type="text" className="px-3 py-1" placeholder="Type" />
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
          {Array.isArray(allItems) && allItems.length > 0 ? (
            allItems.slice(0, 24).map((item, key) => {
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
      <div className="mt-[115px] flex flex-col">
        <p>Chosen items</p>
        <div className="flex">
          {Array.isArray(chosenItems) && chosenItems.length > 0 ? (
            chosenItems.map((item, index) => {
              return (
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                    item.id +
                    ".png"
                  }
                  height={25}
                  width={25}
                  key={index}
                  alt={item.name}
                />
              );
            })
          ) : (
            <p>No items chosen</p>
          )}
        </div>
        <form className="flex flex-col gap-y-3 text-black">
          <input
            type="text"
            name="champion"
            value={formValues.champion}
            onChange={handleInputChange}
            className="px-3 py-1"
            placeholder="Champion"
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
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBuild;
