const react = async (axiosInstance, objectId, value) => {
  try {
    const response = await axiosInstance.put(
      `/comments/react?objectId=${objectId}&value=${value}`
    );
    return response.data;
  } catch (error) {
    console.log("Error reacting for message:", error);
  }
};
export default react;
