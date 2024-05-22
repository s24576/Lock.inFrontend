"use client";

import { createContext, useContext, useEffect, useState } from "react";
import getVersion from "../api/ddragon/getVersion";

export const SearchContext = createContext();

export function SearchContextProvider({ children }) {
  //roboczo zmien useState na true zeby widziec strone po zalogowaniu
  const [paramsData, setParamsData] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [masteryData, setMasteryData] = useState([]);
  const [rankData, setRankData] = useState([]);
  const [matchHistoryData, setMatchHistoryData] = useState([]);
  const [lastMatches, setLastMatches] = useState([]);
  const [version, setVersion] = useState("");

  useEffect(() => {
    const getV = async () => {
      try {
        const version = await getVersion();
        setVersion(version);
      } catch (error) {
        console.log(error);
      }
    };

    getV();
  }, []);

  return (
    <SearchContext.Provider
      value={{
        paramsData,
        setParamsData,
        playerData,
        setPlayerData,
        masteryData,
        setMasteryData,
        rankData,
        setRankData,
        matchHistoryData,
        setMatchHistoryData,
        lastMatches,
        setLastMatches,
        version,
        setVersion,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
