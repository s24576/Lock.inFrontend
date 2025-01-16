const leaveChat = async (axiosIstance, chatId) => {
    console.log("chatId id : ", chatId);
    try {
      const response = await axiosIstance.delete(
        `/messenger/leaveChat?chatId=${chatId}`
      );
      console.log("deleted chatId");
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting chatId");
    }
  };
  
  export default leaveChat;
  