const addReport = async (axiosInstance, reportForm) => {
  try {
    const response = await axiosInstance.post(
      `/api/report/addReport?`,
      reportForm
    );
    return response.data;
  } catch (error) {
    console.log("Error adding report:", error);
  }
};

export default addReport;
