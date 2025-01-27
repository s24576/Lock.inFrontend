"use client";

import { createContext, useContext, useEffect, useState } from "react";
import getVersion from "../api/ddragon/getVersion";

export const SearchContext = createContext();

export function SearchContextProvider({ children }) {
  const [paramsData, setParamsData] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [matchHistoryData, setMatchHistoryData] = useState([]);
  const [lastMatches, setLastMatches] = useState([]);
  const [version, setVersion] = useState("");
  const [queueList, setQueueList] = useState("");

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
        matchHistoryData,
        setMatchHistoryData,
        lastMatches,
        setLastMatches,
        version,
        setVersion,
        queueList,
        setQueueList,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
