const getMatchInfo = async (axiosInstance, matchId) => {
  try {
    const response = await axiosInstance.get(
      `/riot/getMatchInfo?matchId=${matchId}`
    );
    console.log("match by id: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching match by id:", error);
    throw new Error("Error fetching match by id");
  }
};

export default getMatchInfo;
