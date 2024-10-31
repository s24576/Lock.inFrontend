"use client";
import React, { useState, useContext, useEffect, act } from "react";
import { UserContext } from "../context/UserContext";
import useAxios from "../hooks/useAxios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SearchContext } from "../context/SearchContext";
import { useQuery } from "react-query";

const Mainpage = () => {
  const { userData, isLogged, setUserData, setIsLogged } =
    useContext(UserContext);
  const { version } = useContext(SearchContext);

  const [followedProfiles, setFollowedProfiles] = useState([]);

  const [myAccounts, setMyAccounts] = useState([]);

  const api = useAxios();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await api.get("/user/getUserData");
        if (response.status === 200) {
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...response.data, // Poprawne rozpakowanie danych użytkownika do stanu
          }));
          console.log(response.data);
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Możesz dodać tutaj dodatkową obsługę błędów, jeśli jest potrzebna
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    const fetchFollowed = async () => {
      try {
        const response = await api.get(`/riot/getWatchlistRiotProfiles`);
        console.log("followed profiles:", response.data);
        setFollowedProfiles(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMyAccounts = async () => {
      try {
        const response = await api.get(`/riot/getMyRiotProfiles`);
        console.log("claimed accounts: ", response.data);
        setMyAccounts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFollowed();
    fetchMyAccounts();
  }, []);

  //cache Kicker7
  const { error: findPlayerError, isLoading: findPlayerIsLoading } = useQuery(
    "findPlayer",
    async () => {
      try {
        const response = await api.get(
          `riot/findPlayer?server=eun1&tag=eune&name=Kicker7`
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //cache gbe chief keef
  const { error: findPlayerError2, isLoading: findPlayerIsLoading2 } = useQuery(
    "findPlayer2",
    async () => {
      try {
        const response = await api.get(
          `riot/findPlayer?server=eun1&tag=gbe&name=gbe%20chief%20keef`
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const redirectToProfile = async (puuid, server) => {
    try {
      const response = await api.get(
        `/riot/findPlayer?puuid=${puuid}&server=${server}`
      );
      console.log(response.data);
      if (response.status === 200) {
        router.push(
          `/summoner/${response.data.server}/${response.data.tagLine}/${response.data.gameName}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-white">
      <p>Mainpage</p>
      {isLogged && (
        <div>
          {isLogged && <p>Hello {userData.username}!</p>}
          <h1 className="text-[36px]">{t("header")}</h1>
          {Array.isArray(followedProfiles) && followedProfiles.length > 0 ? (
            <div className="flex flex-col gap-y-2">
              {followedProfiles.map((profile, index) => {
                if (profile.gameName !== null) {
                  return (
                    <div
                      key={index}
                      className="flex gap-x-4 items-center hover:bg-[#1a1a1a] cursor-pointer rounded-2xl"
                      onClick={() =>
                        redirectToProfile(profile.puuid, profile.server)
                      }
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
                      <p>{profile.server}</p>
                      <p>{profile.summonerLevel} lvl</p>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="flex gap-x-4"
                      onClick={() =>
                        redirectToProfile(profile.puuid, profile.server)
                      }
                    >
                      <p>Summoner</p>
                      <p>{profile.server}</p>
                      <p>puuid: {profile.puuid}</p>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <p>{t("noneFollowed")}</p>
          )}
          {Array.isArray(myAccounts) && myAccounts.length > 0 ? (
            <div className="mt-8">
              <h1 className="text-[36px]">Claimed accounts:</h1>
              {myAccounts.map((account, index) => {
                return (
                  <div
                    key={index}
                    className="flex gap-x-4 items-center hover:bg-[#1a1a1a] cursor-pointer rounded-2xl"
                    onClick={() =>
                      redirectToProfile(account.puuid, account.server)
                    }
                  >
                    <Image
                      src={
                        "https://ddragon.leagueoflegends.com/cdn/" +
                        version +
                        "/img/profileicon/" +
                        account.profileIconId +
                        ".png"
                      }
                      width={50}
                      height={50}
                      alt="summonerIcon"
                      className="rounded-full border-2 border-white"
                    />
                    <p>{account.gameName}</p>
                    <p>{account.server}</p>
                    <p>{account.summonerLevel} lvl</p>
                  </div>
                );
              })}
            </div>
          ) : (
            "not fetched"
          )}
        </div>
      )}
    </div>
  );
};

export default Mainpage;
