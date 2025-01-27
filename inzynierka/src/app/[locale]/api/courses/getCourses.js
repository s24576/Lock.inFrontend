import axios from "axios";

const getCourses = async (axiosInstance, page) => {
  const size = 5;

  if (page === undefined) {
    page = 0;
  }

  try {
    let url = `/api/course/getCourses?size=${size}&page=${page}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getCourses;
