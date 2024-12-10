const addComment = async (axiosInstance, objectId, comment) => {
  console.log("comment data: ", objectId, comment);

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
};

export default addComment;
