const getChats = async (axiosInstance, size) => {
  try {
    const response = await axiosInstance.get(
      `/messenger/getChats?size=${size}`
    );
    console.log("chats:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching chats");
  }
};

export default getChats;
