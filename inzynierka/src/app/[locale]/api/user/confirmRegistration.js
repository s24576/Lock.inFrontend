const confirmRegistration = async (axiosInstance, confirmationToken) => {
  console.log("confirmationToken: ", confirmationToken);

  try {
    const response = await axiosInstance.post(`/user/confirmRegistration`, {
      confirmationToken,
    });
    console.log("registration confirmed: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error confirming registration:", error);
    throw new Error("Error confirming registration:");
  }
};

export default confirmRegistration;
