const deleteComment = async (axiosIstance, commentId) => {
  console.log(commentId);
  try {
    const response = await axiosIstance.delete(
      `/comments/deleteComment?commentId=${commentId}`
    );
    console.log("deleted comment");
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting comment");
  }
};

export default deleteComment;
