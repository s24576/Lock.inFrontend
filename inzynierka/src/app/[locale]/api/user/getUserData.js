const getUserData = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/user/getUserData`);
    return response.data;
  } catch (error) {
    console.log("Error fetching user data:", error);
  }
};

export default getUserData;
