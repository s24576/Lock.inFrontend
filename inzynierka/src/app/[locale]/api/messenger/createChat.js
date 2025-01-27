const createChat = async (axiosInstance, chatBody) => {
  console.log("chat body: ", chatBody);

  try {
    const response = await axiosInstance.post(
      `/messenger/createChat?`,
      chatBody
    );
    console.log("chat created: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error creating chat:", error);
    throw new Error("Error creating chat:");
  }
};

export default createChat;
