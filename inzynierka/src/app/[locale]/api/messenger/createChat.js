const createChat = async (axiosInstance, chatBody) => {
  try {
    const response = await axiosInstance.post(
      `/messenger/createChat?`,
      chatBody
    );
    return response.data;
  } catch (error) {
    console.log("Error creating chat:", error);
  }
};

export default createChat;
