const cancelFriendRequest = async (axiosIstance, requestId) => {
  try {
    const response = await axiosIstance.delete(
      `/profile/cancelFriendRequest?requestId=${requestId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default cancelFriendRequest;
