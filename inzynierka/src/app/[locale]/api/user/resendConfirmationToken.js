const resendConfirmationToken = async (axiosInstance) => {
  try {
    const response = await axiosInstance.put(`/user/resendConfirmationToken`);
    return response.data;
  } catch (error) {
    console.log("Error sending confirmation token:", error);
  }
};

export default resendConfirmationToken;
