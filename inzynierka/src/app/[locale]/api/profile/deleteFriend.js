const deleteFriend = async (axiosIstance, friendId) => {
  console.log(friendId);
  try {
    const response = await axiosIstance.delete(
      `/profile/deleteFriend?friendId=${friendId}`
    );
    console.log("deleted friend");
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting friend");
  }
};

export default deleteFriend;
