import useAxiosPublic from "../../hooks/useAxiosPublic";

const findPlayer = async (axiosInstance, server, name, tag) => {
  //   const server = matchId.split("_")[0];

  console.log("findPlayer");
  console.log(server, name, tag);
  try {
    const response = await axiosInstance.get(
      `riot/findPlayer?server=${server}&name=${name}&tag=${tag}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default findPlayer;
