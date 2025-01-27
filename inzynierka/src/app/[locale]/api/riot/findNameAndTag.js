const findNameAndTag = async (axiosInstance, server, puuid) => {
  try {
    const response = await axiosInstance.get(
      `/riot/findNameAndTag?server=${server}&puuid=${puuid}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default findNameAndTag;
