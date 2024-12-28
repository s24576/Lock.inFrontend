const getLocale = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/user/getLocale`);
    console.log("locale : ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching locale:", error);
    throw new Error("Error fetching locale"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getLocale;
