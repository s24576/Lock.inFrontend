const sendFriendRequest = async (axiosInstance, to) => {
  console.log("to: ", to);

  try {
    const result = await axiosInstance.post(`/profile/sendFriendRequest`, {
      to: to,
    });
    console.log("sending friend request : ", result.data);
    return result.data;
  } catch (error) {
    console.log("Error fetching sending friend request:", error);
  }
};

export default sendFriendRequest;
