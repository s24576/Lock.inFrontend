import axios from "axios";

const getCourseById = async (axiosInstance, courseId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/getCourseById?courseId=${courseId}`
    );
    console.log("course by id:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching course by id");
  }
};

export default getCourseById;
