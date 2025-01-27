const getMessages = async (axiosInstance, chatId, size) => {
  if (size === undefined) {
    size = 20;
  }

  try {
    const response = await axiosInstance.get(
      `/messenger/getMessages?chatId=${chatId}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getMessages;
