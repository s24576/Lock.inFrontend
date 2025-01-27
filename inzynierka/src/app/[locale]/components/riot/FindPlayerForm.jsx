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
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const axiosInstance = useAxiosPublic();

  const { t } = useTranslation();

  const { refetch: findPlayerRefetch, isLoading: findPlayerIsLoading } =
    useQuery(
      ["findPlayer"],
      () => findPlayer(axiosInstance, server, username, tag),
      {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          setErrorMessage("");
          router.push(
            `/summoner/${data.server}/${data.tagLine}/${data.gameName}`
          );
        },
        onError: (error) => {
          if (error.response) {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage(error.message || "An error occurred");
          }
        },
      }
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (username && tag) {
      findPlayerRefetch();
    } else {
      setErrorMessage(t("riot:missingFields"));
    }
  };

  return (
    <>
      <div
        className="rounded-md"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <form className="flex py-3 pr-6 items-center" onSubmit={handleSubmit}>
          <Select value={server} onValueChange={setServer}>
            <SelectTrigger className="flex items-center gap-x-2 bg-transparent text-[24px] text-white-smoke focus:border-none focus:outline-none hover:text-amber px-10 w-[150px]">
              {servers.find((s) => s.value === server)?.icon || (
                <FaGlobeAmericas className="text-[28px]" />
              )}
              <p>{servers.find((s) => s.value === server)?.name || "EUNE"}</p>
            </SelectTrigger>
            <SelectContent
              className="text-white-smoke mt-2"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
              {servers.map((serverOption, key) => (
                <SelectItem key={key} value={serverOption.value}>
                  <div className="flex font-bangers text-[28px] items-center gap-x-2 hover:bg-transparent">
                    {serverOption.icon}
                    <p className="text-[24px]">{serverOption.name}</p>
                  </div>
                </SelectItem>
              ))}
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
            className="px-4 bg-transparent text-white-smoke focus:outline-none text-[24px] placeholder-white-smoke w-[180px] text-center"
            placeholder={t("mainpage:tag")}
            onChange={(e) => setTag(e.target.value)}
            value={tag}
          />
          <button type="submit" disabled={findPlayerIsLoading}>
            <BiSolidLock
              className={`text-[48px] transition-colors duration-100 ${
                findPlayerIsLoading ? "text-amber" : "hover:text-amber"
              }`}
            />
          </button>
        </form>
      </div>
      {errorMessage && (
        <p className="text-amber text-center text-[24px]">{errorMessage}</p>
      )}
    </>
  );
};

export default FindPlayerForm;
