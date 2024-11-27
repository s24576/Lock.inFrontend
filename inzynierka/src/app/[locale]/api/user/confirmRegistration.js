const confirmRegistration = async (axiosInstance, confirmationToken) => {
  console.log("confirmationToken: ", confirmationToken);

  try {
    const response = await axiosInstance.post(`/user/confirmRegistration`, {
      confirmationToken,
    });
    console.log("registration confirmed: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error confirming registration:", error);
    throw new Error("Error confirming registration:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default confirmRegistration;
