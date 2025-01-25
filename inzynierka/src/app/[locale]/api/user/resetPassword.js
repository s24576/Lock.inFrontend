const resetPassword = async (axiosInstance, email) => {
  console.log("resetting password: ", email);

  try {
    const response = await axiosInstance.put(
      `http://localhost:8080/user/resetPassword`,
      {
        email,
      },
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    console.log("password has been reset: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error resetting password:", error);
    throw new Error("Error resetting password:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default resetPassword;
