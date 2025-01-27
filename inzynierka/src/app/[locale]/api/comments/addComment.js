const addComment = async (axiosInstance, objectId, comment, replyingTo) => {
  if (replyingTo.length > 1) {
    try {
      const response = await axiosInstance.post(`/comments/addComment`, {
        objectId: objectId,
        comment: comment,
        replyingTo: replyingTo,
      });
      return response.data;
    } catch (error) {
      console.log("Error adding reply:", error);
    }
  } else {
    try {
      const response = await axiosInstance.post(`/comments/addComment`, {
        objectId: objectId,
        comment: comment,
      });
      return response.data;
    } catch (error) {
      console.log("Error adding comment:", error);
    }
  }
};

export default addComment;
