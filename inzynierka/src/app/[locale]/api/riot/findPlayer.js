import useAxiosPublic from "../../hooks/useAxiosPublic";

const findPlayer = async (axiosInstance, server, name, tag) => {
  try {
    const response = await axiosInstance.get(
      `riot/findPlayer?server=${server}&name=${name}&tag=${tag}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default findPlayer;
