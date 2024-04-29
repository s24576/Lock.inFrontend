import React, { useContext, useState, useEffect } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import { SearchContext } from "../context/SearchContext";

const FindPlayer = () => {
  const {
    setParamsData,
    setPlayerData,
    setMasteryData,
    setRankData,
    setLastMatches,
    setMatchHistoryData,
    lastMatches,
  } = useContext(SearchContext);

  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [server, setServer] = useState("eun1");
  const [resultsFound, setResultsFound] = useState(false);

  useEffect(() => {
    setLastMatches([]);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(server);
      console.log(tag);
      console.log(username);
      const response = await axios.get(
        `http://localhost:8080/riot/findPlayer?server=${server}&tag=${tag}&name=${username}`
      );

      setParamsData({ server, tag, username });
      setPlayerData(response.data);
      console.log(response.data);

      const masteryResponse = await axios.get(
        `http://localhost:8080/riot/getChampionMastery?server=${server}&puuid=${response.data.puuid}`
      );

      if (masteryResponse.data) {
        setMasteryData(masteryResponse.data);
        console.log(masteryResponse.data);
      }

      const rankResponse = await axios.get(
        `http://localhost:8080/riot/getRanks?server=${server}&summonerId=${response.data.id}`
      );

      if (rankResponse.data) {
        setRankData(rankResponse.data);
        console.log(rankResponse.data);
      }

      const matchHistoryResponse = await axios.get(
        `http://localhost:8080/riot/getMatchHistory?puuid=${response.data.puuid}`
      );

      setMatchHistoryData(matchHistoryResponse.data);
      console.log(matchHistoryResponse.data);

      for (let i = 0; i < matchHistoryResponse.data.length; i++) {
        const matchDetailsResponse = await axios.get(
          `http://localhost:8080/riot/getMatchInfo?matchId=${matchHistoryResponse.data[i]}`
        );
        console.log(matchDetailsResponse.data);
        setLastMatches((prevMatches) => [
          ...prevMatches,
          matchDetailsResponse.data,
        ]);
        console.log(lastMatches);
      }

      setResultsFound(true);
    } catch (error) {
      // Handle error
      console.error("Error occurred:", error);
    }
  };

  if (resultsFound) {
    redirect(`/summoner/${server}/${tag}/${username}`);
  }

  return (
    <div className="h-screen w-full flex justify-center items-center flex-col">
      <p className="text-white">Find Player</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[280px] gap-2 text-black"
      >
        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <select value={server} onChange={(e) => setServer(e.target.value)}>
          <option value="eun1">EUNE</option>
          <option value="euw1">EUW</option>
          <option value="na1">NA</option>
        </select>

        <button type="submit" className="text-white">
          Search
        </button>
      </form>
    </div>
  );
};

export default FindPlayer;
