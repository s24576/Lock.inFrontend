const getNotifications = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(
      `/profile/getNotifications?size=10`
    );
    console.log("notifications : ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching notifications:", error);
    throw new Error("Error fetching notifications"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getNotifications;
