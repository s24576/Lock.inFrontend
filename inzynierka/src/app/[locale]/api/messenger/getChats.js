const getChats = async (axiosInstance, size) => {
  if (size === undefined) {
    size = 10;
  }

  try {
    const response = await axiosInstance.get(
      `/messenger/getChats?size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getChats;
