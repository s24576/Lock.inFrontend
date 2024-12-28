const findNameAndTag = async (axiosInstance, server, puuid) => {
  try {
    console.log("siema");
    console.log("serwer: ", server);
    console.log("puuid", puuid);
    const response = await axiosInstance.get(
      `/riot/findNameAndTag?server=${server}&puuid=${puuid}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default findNameAndTag;
