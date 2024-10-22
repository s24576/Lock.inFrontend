const getMyRiotProfiles = async (api) => {
  try {
    const response = await api.get(`/riot/getMyRiotProfiles`);
    console.log("claimed accounts for duo: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching riot profiles:", error);
    throw new Error("Error fetching riot profiles"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default getMyRiotProfiles;
