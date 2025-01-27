const confirmRegistration = async (axiosInstance, confirmationToken) => {
  try {
    const response = await axiosInstance.post(`/user/confirmRegistration`, {
      confirmationToken,
    });
    return response.data;
  } catch (error) {
    console.log("Error confirming registration:", error);
  }
};

export default confirmRegistration;
