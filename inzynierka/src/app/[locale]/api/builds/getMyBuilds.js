const getMyBuilds = async (axiosInstance, page) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }

  console.log("page", page);

  try {
    // Budowanie URL-a dynamicznie
    let url = `/build/getMyBuilds?size=${size}&page=${page}`;

    const response = await axiosInstance.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getMyBuilds;
