const getMyRiotProfiles = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/riot/getMyRiotProfiles`);
    return response.data;
  } catch (error) {
    console.log("Error fetching riot profiles:", error);
  }
};

export default getMyRiotProfiles;
