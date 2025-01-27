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
    );
    console.log("match history: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching match history:", error);
    throw new Error("Error fetching match history");
  }
};

export default getMatchHistory;
