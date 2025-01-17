import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import useAxiosPublic from "../../hooks/useAxiosPublic";

import findPlayer from "../../api/riot/findPlayer";

import { FaGlobeAmericas, FaGlobeEurope } from "react-icons/fa";
import { BiSolidLock } from "react-icons/bi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/componentsShad/ui/select";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const servers = [
  {
    name: "EUNE",
    value: "eun1",
    icon: <FaGlobeEurope className="text-[28px]" />,
  },
  {
    name: "EUW",
    value: "euw1",
    icon: <FaGlobeEurope className="text-[28px]" />,
  },
  {
    name: "NA",
    value: "na1",
    icon: <FaGlobeAmericas className="text-[28px]" />,
  },
];

const FindPlayerForm = () => {
  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [server, setServer] = useState("eun1");

  const router = useRouter();
  const axiosInstance = useAxiosPublic();

  const {t} = useTranslation();

  const { refetch: findPlayerRefetch, isLoading: findPlayerIsLoading } =
    useQuery(
      ["findPlayer"],
      () => findPlayer(axiosInstance, server, username, tag),
      {
        enabled: false, // Wyłączamy automatyczne uruchamianie zapytania
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          router.push(
            `/summoner/${data.server}/${data.tagLine}/${data.gameName}`
          );
        },
        onError: (error) => {
          toast.error("An error occurred", {
            description: error,
          });
        },
      }
    );

  const handleSubmit = async (e) => {
    e.preventDefault(); // Zatrzymujemy domyślne zachowanie formularza

    // Walidacja
    if (username && tag) {
      findPlayerRefetch(); // Wywołujemy zapytanie tylko po kliknięciu
    } else {
      console.error("Username and Tag are required!");
      toast.error("Username and Tag are required!");
    }
  };

  return (
    <div
      className="rounded-md"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <form
        className="flex py-3 pr-6 items-center"
        onSubmit={handleSubmit} // Poprawione wywołanie `handleSubmit`
      >
        <Select>
          <SelectTrigger className="flex items-center gap-x-2 bg-transparent text-[24px] text-white-smoke focus:border-none focus:outline-none hover:text-amber px-10 w-[150px]">
            <FaGlobeAmericas className="text-[28px] "></FaGlobeAmericas>
            <p>EUNE</p>
          </SelectTrigger>
          <SelectContent
            className="text-white-smoke mt-2"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            {servers.map((server, key) => {
              return (
                <SelectItem
                  key={key}
                  value={server.value}
                  onClick={() => setServer(server.value)}
                >
                  <div className="flex font-bangers text-[28px] items-center gap-x-2 hover:bg-transparent">
                    {server.icon}
                    <p className="text-[24px]">{server.name}</p>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <input
          type="text"
          className="border-x-2 border-x-white-smoke px-4 bg-transparent text-white-smoke focus:outline-none text-[24px] placeholder-white-smoke w-[350px] text-center"
          placeholder={t("mainpage:username")}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="text"
          className=" px-4 bg-transparent text-white-smoke focus:outline-none text-[24px] placeholder-white-smoke w-[180px] text-center"
          placeholder={t("mainpage:tag")}
          onChange={(e) => setTag(e.target.value)}
          value={tag}
        />
        <button type="submit">
          <BiSolidLock
            className={
              findPlayerIsLoading
                ? "text-[48px] text-amber transition-colors duration-100"
                : "text-[48px] hover:text-amber transition-colors duration-100"
            }
          ></BiSolidLock>
        </button>
      </form>
    </div>
  );
};

export default FindPlayerForm;
