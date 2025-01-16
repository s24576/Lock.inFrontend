const sendMessage = async (axiosInstance, chatId, messageBody) => {
    console.log("msg body: ", messageBody);
  

    try {
      const response = await axiosInstance.post(`/messenger/sendMessage?chatId=${chatId}`, messageBody); // Wysyłamy zapytanie do API
      console.log("message sent: ", response.data);
      return response.data; // Zwracamy dane
    } catch (error) {
      console.log("Error creating message:", error);
      throw new Error("Error creating message:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
    }
  };
  
  export default sendMessage;
  