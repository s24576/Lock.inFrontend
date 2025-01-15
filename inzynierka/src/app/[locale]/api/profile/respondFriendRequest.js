const respondFriendRequest = async (axiosInstance, reqId, response) => {
  console.log("reqId: ", reqId);
  console.log("response: ", response);

  const data = {
    requestId: reqId,
    response: response,
  };

  try {
    const result = await axiosInstance.post(`/profile/respondFriendRequest`, {
      response: response,
      requestId: reqId,
    });
    console.log("responding friend request : ", result.data);
    return result.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching responding friend request:", error);
    throw new Error("Error fetching responding friend request"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default respondFriendRequest;
