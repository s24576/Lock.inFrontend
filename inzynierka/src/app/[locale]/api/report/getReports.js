const getReports = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get("/api/report/getReports");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getReports;
