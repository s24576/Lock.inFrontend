const createBuild = async (axiosInstance, buildData) => {
  try {
    const response = await axiosInstance.post(`/build/createBuild`, buildData);
    return response.data;
  } catch (error) {
    console.log("Error creating build:", error);
  }
};

export default createBuild;
