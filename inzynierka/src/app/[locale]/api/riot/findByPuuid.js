const findByPuuid = async (axiosInstance, server, puuid) => {
  try {
    const response = await axiosInstance.get(
      `/riot/findPlayer?server=${server}&puuid=${puuid}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default findByPuuid;
