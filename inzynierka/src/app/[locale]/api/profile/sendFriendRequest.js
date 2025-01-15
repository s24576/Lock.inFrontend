const sendFriendRequest = async (axiosInstance, to) => {
  console.log("to: ", to);

  try {
    const result = await axiosInstance.post(`/profile/sendFriendRequest`, {
      to: to,
    });
    console.log("sending friend request : ", result.data);
    return result.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching sending friend request:", error);
    throw new Error("Error fetching sending friend request"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default sendFriendRequest;
