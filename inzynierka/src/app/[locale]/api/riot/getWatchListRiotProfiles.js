const getWatchListRiotProfiles = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/riot/getWatchlistRiotProfiles`);
    console.log("followed riot profiles: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching followed riot profiles:", error);
    throw new Error("Error fetching rfollowed riot profiless"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getWatchListRiotProfiles;
