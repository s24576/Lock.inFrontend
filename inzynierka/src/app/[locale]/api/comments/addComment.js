const addComment = async (axiosInstance, objectId, comment, replyingTo) => {
  console.log("comment data: ", objectId, comment, replyingTo);
  console.log("replyingTo: ", replyingTo);

  if (replyingTo.length > 1) {
    try {
      const response = await axiosInstance.post(`/comments/addComment`, {
        objectId: objectId,
        comment: comment,
        replyingTo: replyingTo,
      });
      console.log("reply created: ", response.data);
      return response.data; // Zwracamy dane
    } catch (error) {
      console.log("Error adding reply:", error);
      throw new Error("Error adding reply:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
    }
  } else {
    try {
      const response = await axiosInstance.post(`/comments/addComment`, {
        objectId: objectId,
        comment: comment,
      });
      console.log("comment created: ", response.data);
      return response.data; // Zwracamy dane
    } catch (error) {
      console.log("Error adding comment:", error);
      throw new Error("Error adding comment:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
    }
  }
};

export default addComment;
