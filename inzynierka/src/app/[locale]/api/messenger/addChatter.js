const addChatter = async (axiosInstance, chatId, username) => {
  try {
    const response = await axiosInstance.post(
      `/messenger/addChatter?chatId=${chatId}&username=${username}`
    );
    return response.data;
  } catch (error) {
    console.log("Error member adding :", error);
  }
};

export default addChatter;
