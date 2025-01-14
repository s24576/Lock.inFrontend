const getDuos = async (axiosInstance, filterBody, page) => {
  const size = 15;
  console.log(filterBody);

  if (page === undefined) {
    page = 0;
  }
  try {
    const response = await axiosInstance.post(
      `/api/duo/getDuos?size=${size}&page=${page}`,
      filterBody
    );
    console.log("duos", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching duos");
  }
};

export default getDuos;
