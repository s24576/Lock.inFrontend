const getMyCourses = async (axiosInstance, page) => {
  const size = 3;

  if (page === undefined) {
    page = 0;
  }

  try {
    let url = `/api/course/getMyCourses?size=${size}&page=${page}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getMyCourses;
