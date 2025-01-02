import axios from "axios";

const getChampionNames = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get("/ddragon/getChampionNames");
    const sortedChampionNames = Object.entries(response.data).sort(
      ([, a], [, b]) => a.localeCompare(b)
    );

    console.log(Object.fromEntries(sortedChampionNames));
    return Object.fromEntries(sortedChampionNames);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching champion names");
  }
};

export default getChampionNames;
