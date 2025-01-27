const sendFriendRequest = async (axiosInstance, to) => {
  try {
    const result = await axiosInstance.post(`/profile/sendFriendRequest`, {
      to: to,
    });
    return result.data;
  } catch (error) {
    console.log("Error fetching sending friend request:", error);
  }
};

export default sendFriendRequest;
