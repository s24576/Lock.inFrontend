const addChatter = async (axiosInstance, chatId, username) => {
  console.log("chat body: ", chatId, username);

  try {
    const response = await axiosInstance.post(
      `/messenger/addChatter?chatId=${chatId}&username=${username}`
    );
    console.log("member added: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error member adding :", error);
    throw new Error("Error member adding :");
  }
};

export default addChatter;
