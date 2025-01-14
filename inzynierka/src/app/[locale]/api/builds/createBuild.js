const createBuild = async (axiosInstance, buildData) => {
  console.log("buildData: ", buildData);

  try {
    const response = await axiosInstance.post(`/build/createBuild`, buildData);
    console.log("build created: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error creating build:", error);
    throw new Error("Error creating build:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default createBuild;
