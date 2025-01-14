const getMyCourses = async (axiosInstance, page) => {
  const size = 3;

  if (page === undefined) {
    page = 0;
  }

  console.log("page", page);

  try {
    // Budowanie URL-a dynamicznie
    let url = `/api/course/getMyCourses?size=${size}&page=${page}`;

    const response = await axiosInstance.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getMyCourses;
