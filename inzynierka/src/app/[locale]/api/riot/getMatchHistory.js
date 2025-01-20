const getMatchHistory = async (axiosInstance, puuid, count, queue) => {
  if (count === undefined) {
    count = 5;
  }
  console.log("puuid", puuid);
  console.log("count", count);
  console.log("queue", queue);

  try {
    const response = await axiosInstance.get(
      `/riot/getMatchHistory?puuid=${puuid}&count=${count}&queue=${queue}`
    ); // Wywołujemy zapytanie do API
    console.log("match history: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching match history:", error);
    throw new Error("Error fetching match history"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getMatchHistory;
