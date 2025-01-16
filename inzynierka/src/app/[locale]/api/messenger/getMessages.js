const getMessages = async (axiosInstance, chatId, size) => {
  if (size === undefined) {
    size = 20;
  }

  console.log("xxxxx", chatId, size);

  try {
    const response = await axiosInstance.get(
      `/messenger/getMessages?chatId=${chatId}&size=${size}`
    );
    console.log("messages:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching chats");
  }
};

export default getMessages;
