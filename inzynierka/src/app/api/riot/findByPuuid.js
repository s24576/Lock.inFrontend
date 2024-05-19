import axios from "axios";

const findByPuuid = async (matchId, puuid) => {
  const server = matchId.split("_")[0];

  try {
    const response = await axios.get(
      `http://localhost:8080/riot/findPlayerByPuuid?server=${server}&puuid=${puuid}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default findByPuuid;
