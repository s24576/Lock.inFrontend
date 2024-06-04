"use client";

import { createContext, useContext, useEffect, useState } from "react";
import getVersion from "../api/ddragon/getVersion";

export const SearchContext = createContext();

export function SearchContextProvider({ children }) {
  //roboczo zmien useState na true zeby widziec strone po zalogowaniu
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
        console.log(version);
        setVersion(version);
      } catch (error) {
        console.log(error);
      }
    };

    getV();
  }, []);

  // useEffect(() => {
  //   const getQ = async () => {
  //     try {
  //       const data = await getQueues();
  //       setQueueList(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getQ();
  // }, []);

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
