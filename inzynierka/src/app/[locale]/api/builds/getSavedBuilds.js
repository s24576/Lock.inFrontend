const getSavedBuilds = async (axiosInstance, page) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }

  console.log("page", page);

  try {
    let url = `/build/getSavedBuilds?size=${size}&page=${page}`;

    const response = await axiosInstance.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getSavedBuilds;
