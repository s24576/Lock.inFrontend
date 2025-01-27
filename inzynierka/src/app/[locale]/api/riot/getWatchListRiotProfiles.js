const getWatchListRiotProfiles = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/riot/getWatchlistRiotProfiles`);
    return response.data;
  } catch (error) {
    console.log("Error fetching followed riot profiles:", error);
  }
};

export default getWatchListRiotProfiles;
