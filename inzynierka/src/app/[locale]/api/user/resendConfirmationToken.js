const resendConfirmationToken = async (axiosInstance) => {
  console.log("resending confirmationToken: ");

  try {
    const response = await axiosInstance.put(`/user/resendConfirmationToken`);
    console.log("confirmation token sent: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error sending confirmation token:", error);
    throw new Error("Error sending confirmation token:");
  }
};

export default resendConfirmationToken;
