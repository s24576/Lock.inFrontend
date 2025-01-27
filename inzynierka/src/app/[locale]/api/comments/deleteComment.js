const deleteComment = async (axiosIstance, commentId) => {
  try {
    const response = await axiosIstance.delete(
      `/comments/deleteComment?commentId=${commentId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default deleteComment;
