const createCourse = async (axiosInstance, courseData) => {
  try {
    const response = await axiosInstance.post(
      `/api/course/addCourse`,
      courseData
    );
    return response.data;
  } catch (error) {
    console.log("Error creating course:", error);
  }
};

export default createCourse;
