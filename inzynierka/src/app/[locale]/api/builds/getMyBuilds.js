const getMyBuilds = async (axiosInstance, page) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }

  try {
    let url = `/build/getMyBuilds?size=${size}&page=${page}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getMyBuilds;
