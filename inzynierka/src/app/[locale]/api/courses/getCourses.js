import axios from "axios";

const getCourses = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get("/api/course/getCourses");
    console.log("courses", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching courses");
  }
};

export default getCourses;
