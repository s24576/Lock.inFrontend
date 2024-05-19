import axios from "axios";

const fetchData = async (matchId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/riot/getMatchInfo?matchId=${matchId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchData;
