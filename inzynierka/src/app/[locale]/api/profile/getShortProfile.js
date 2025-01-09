const getShortProfile = async (axiosInstance, username) => {
  try {
    const response = await axiosInstance.get(
      `/profile/getShortProfile?username=${username}`
    );
    console.log("short lockin profile: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching short lockin profile:", error);
    throw new Error("Error fetching short lockin profile"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getShortProfile;
