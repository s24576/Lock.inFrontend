const register = async (axiosInstance, registerData) => {
  try {
    const response = await axiosInstance.post(`/user/register`, registerData);
    return response.data;
  } catch (error) {
    console.log("Error registering:", error);
  }
};

export default register;
