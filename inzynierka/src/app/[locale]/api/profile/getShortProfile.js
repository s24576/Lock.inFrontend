const getShortProfile = async (axiosInstance, username) => {
  try {
    const response = await axiosInstance.get(
      `/profile/getShortProfile?username=${username}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching short lockin profile:", error);
  }
};

export default getShortProfile;
