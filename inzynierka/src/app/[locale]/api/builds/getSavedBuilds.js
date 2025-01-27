const getSavedBuilds = async (axiosInstance, page) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }

  try {
    let url = `/build/getSavedBuilds?size=${size}&page=${page}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getSavedBuilds;
