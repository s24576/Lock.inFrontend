const cancelFriendRequest = async (axiosIstance, requestId) => {
  try {
    const response = await axiosIstance.delete(
      `/profile/cancelFriendRequest?requestId=${requestId}`
    );
    console.log("canceled friend reqquest");
  } catch (error) {
    console.error(error);
    throw new Error("Error canceled friend reqquest");
  }
};

export default cancelFriendRequest;
