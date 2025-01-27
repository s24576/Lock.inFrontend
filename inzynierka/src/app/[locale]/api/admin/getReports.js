const getReports = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get("/api/admin/getReports");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getReports;
