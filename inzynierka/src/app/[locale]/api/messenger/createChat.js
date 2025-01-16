const createChat = async (axiosInstance, chatBody) => {
    console.log("chat body: ", chatBody);
  

    try {
      const response = await axiosInstance.post(`/messenger/createChat?`, chatBody); // Wysyłamy zapytanie do API
      console.log("chat created: ", response.data);
      return response.data; // Zwracamy dane
    } catch (error) {
      console.log("Error creating chat:", error);
      throw new Error("Error creating chat:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
    }
  };
  
  export default createChat;
  