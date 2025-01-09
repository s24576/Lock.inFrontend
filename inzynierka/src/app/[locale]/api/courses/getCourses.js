import axios from "axios";

const getCourses = async (axiosInstance, page) => {
  const size = 5;

  if (page === undefined) {
    page = 0;
  }

  console.log("page", page);

  try {
    // Budowanie URL-a dynamicznie
    let url = `/api/course/getCourses?size=${size}&page=${page}`;

    const response = await axiosInstance.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getCourses;
