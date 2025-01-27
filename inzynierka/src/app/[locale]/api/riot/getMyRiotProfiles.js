const getMyRiotProfiles = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/riot/getMyRiotProfiles`);
    console.log("claimed accounts for duo: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching riot profiles:", error);
    throw new Error("Error fetching riot profiles");
  }
};

export default getMyRiotProfiles;
