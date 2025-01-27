import axios from "axios";

const getChampionNames = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get("/ddragon/getChampionNames");
    const sortedChampionNames = Object.entries(response.data).sort(
      ([, a], [, b]) => a.localeCompare(b)
    );

    return Object.fromEntries(sortedChampionNames);
  } catch (error) {
    console.error(error);
  }
};

export default getChampionNames;
