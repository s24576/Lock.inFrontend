const getReports = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get("/api/report/getReports");
    console.log("reports", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching reports");
  }
};

export default getReports;
