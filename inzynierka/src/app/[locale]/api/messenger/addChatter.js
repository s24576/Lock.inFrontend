const addChatter = async (axiosInstance, chatId, username) => {
    console.log("chat body: ", chatId, username);
  

    try {
      const response = await axiosInstance.post(`/messenger/addChatter?chatId=${chatId}&username=${username}`); // Wysyłamy zapytanie do API
      console.log("member added: ", response.data);
      return response.data; // Zwracamy dane
    } catch (error) {
      console.log("Error member adding :", error);
      throw new Error("Error member adding :"); // Rzucamy błąd, aby React Query mógł go obsłużyć
    }
  };
  
  export default addChatter;
  