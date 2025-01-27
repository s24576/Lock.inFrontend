const getMatchInfo = async (axiosInstance, matchId) => {
  try {
    const response = await axiosInstance.get(
      `/riot/getMatchInfo?matchId=${matchId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching match by id:", error);
  }
};

export default getMatchInfo;
