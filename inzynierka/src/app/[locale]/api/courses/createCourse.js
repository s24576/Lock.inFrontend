const createCourse = async (axiosInstance, courseData) => {
  console.log("course data: ", courseData);

  try {
    const response = await axiosInstance.post(
      `/api/course/addCourse`,
      courseData
    );
    console.log("course created: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error creating course:", error);
    throw new Error("Error creating course:");
  }
};

export default createCourse;
