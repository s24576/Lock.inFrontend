const respondFriendRequest = async (axiosInstance, reqId, response) => {
  try {
    const result = await axiosInstance.post(`/profile/respondFriendRequest`, {
      response: response,
      requestId: reqId,
    });
    return result.data;
  } catch (error) {
    console.log("Error fetching responding friend request:", error);
  }
};

export default respondFriendRequest;
