const createCourse = async (axiosInstance, courseData) => {
  console.log("course data: ", courseData);

  try {
    const response = await axiosInstance.post(
      `/api/course/addCourse`,
      courseData
    );
    console.log("course created: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error creating course:", error);
    throw new Error("Error creating course:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default createCourse;
