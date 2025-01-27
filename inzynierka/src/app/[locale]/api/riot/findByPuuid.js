const findByPuuid = async (axiosInstance, server, puuid) => {
  try {
    const response = await axiosInstance.get(
      `/riot/findPlayer?server=${server}&puuid=${puuid}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default findByPuuid;
