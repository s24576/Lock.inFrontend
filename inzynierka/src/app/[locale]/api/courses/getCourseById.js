import axios from "axios";

const getCourseById = async (axiosInstance, courseId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/getCourseById?courseId=${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getCourseById;
