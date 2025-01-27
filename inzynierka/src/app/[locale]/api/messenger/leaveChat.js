const leaveChat = async (axiosIstance, chatId) => {
  try {
    const response = await axiosIstance.delete(
      `/messenger/leaveChat?chatId=${chatId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default leaveChat;
