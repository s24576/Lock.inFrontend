const deleteFriend = async (axiosIstance, friendId) => {
  try {
    const response = await axiosIstance.delete(
      `/profile/deleteFriend?friendId=${friendId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default deleteFriend;
