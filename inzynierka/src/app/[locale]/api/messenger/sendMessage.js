const sendMessage = async (axiosInstance, chatId, messageBody) => {
  console.log("msg body: ", messageBody);

  try {
    const response = await axiosInstance.post(
      `/messenger/sendMessage?chatId=${chatId}`,
      messageBody
    );
    console.log("message sent: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error creating message:", error);
    throw new Error("Error creating message:");
  }
};

export default sendMessage;
