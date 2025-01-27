const resetPassword = async (axiosInstance, email) => {
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
    return response.data;
  } catch (error) {
    console.log("Error resetting password:", error);
  }
};

export default resetPassword;
