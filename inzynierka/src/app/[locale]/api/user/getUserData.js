const getUserData = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/user/getUserData`);
    console.log("user data : ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching user data:", error);
    throw new Error("Error fetching user data"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getUserData;
