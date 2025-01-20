const getMatchInfo = async (axiosInstance, matchId) => {
  console.log(matchId);

  try {
    const response = await axiosInstance.get(
      `/riot/getMatchInfo?matchId=${matchId}`
    );
    console.log("match by id: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching match by id:", error);
    throw new Error("Error fetching match by id"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getMatchInfo;
