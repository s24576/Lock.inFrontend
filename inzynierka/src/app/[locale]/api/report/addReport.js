const addReport = async (axiosInstance, reportForm) => {
  console.log("report form: ", reportForm);

  try {
    const response = await axiosInstance.post(
      `/api/report/addReport?`,
      reportForm
    );
    console.log("report created: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error adding report:", error);
    throw new Error("Error adding report:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default addReport;
