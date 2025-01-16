const getChatById = async (axiosInstance, chatId) => {
  try {
    const response = await axiosInstance.get(
      `/messenger/getChatById?chatId=${chatId}`
    );
    console.log("chat by id:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching chat by id");
  }
};

export default getChatById;
