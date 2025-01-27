const getNotifications = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(
      `/profile/getNotifications?size=10`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching notifications:", error);
  }
};

export default getNotifications;
