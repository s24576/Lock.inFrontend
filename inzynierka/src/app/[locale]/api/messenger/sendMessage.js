const sendMessage = async (axiosInstance, chatId, messageBody) => {
  try {
    const response = await axiosInstance.post(
      `/messenger/sendMessage?chatId=${chatId}`,
      messageBody
    );
    return response.data;
  } catch (error) {
    console.log("Error creating message:", error);
  }
};

export default sendMessage;
