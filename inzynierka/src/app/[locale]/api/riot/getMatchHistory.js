const getMatchHistory = async (axiosInstance, puuid, count, queue) => {
  if (count === undefined) {
    count = 5;
  }
  try {
    const response = await axiosInstance.get(
      `/riot/getMatchHistory?puuid=${puuid}&count=${count}&queue=${queue}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching match history:", error);
  }
};

export default getMatchHistory;
