const getDuos = async (axiosInstance, filterBody, page) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }
  try {
    const response = await axiosInstance.post(
      `/api/duo/getDuos?size=${size}&page=${page}`,
      filterBody
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getDuos;
