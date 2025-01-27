const getChatById = async (axiosInstance, chatId) => {
  try {
    const response = await axiosInstance.get(
      `/messenger/getChatById?chatId=${chatId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getChatById;
