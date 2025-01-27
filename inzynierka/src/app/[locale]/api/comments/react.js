const react = async (axiosInstance, objectId, value) => {
  console.log("arguments for reaction: ", objectId, value);

  try {
    const response = await axiosInstance.put(
      `/comments/react?objectId=${objectId}&value=${value}`
    );
    console.log("reacted: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error reacting for message:", error);
  }
};
export default react;
