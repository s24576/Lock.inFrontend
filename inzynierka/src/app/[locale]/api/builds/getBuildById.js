const getBuildById = async (axiosInstance, buildId) => {
  try {
    const response = await axiosInstance.get(
      `/build/getBuildById?buildId=${buildId}`
    );
    console.log("build by id:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching build by id");
  }
};

export default getBuildById;
