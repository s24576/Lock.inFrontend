"use client";

import { createContext, useContext, useState } from "react";

export const SearchContext = createContext();

export function SearchContextProvider({ children }) {
  //roboczo zmien useState na true zeby widziec strone po zalogowaniu
  const [paramsData, setParamsData] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [masteryData, setMasteryData] = useState([]);
  const [rankData, setRankData] = useState([]);
  const [matchHistoryData, setMatchHistoryData] = useState([]);
  const [lastMatches, setLastMatches] = useState([]);

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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
