const getBuildById = async (axiosInstance, buildId) => {
  try {
    const response = await axiosInstance.get(
      `/build/getBuildById?buildId=${buildId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getBuildById;
