const register = async (axiosInstance, registerData) => {
  console.log("registering: ", registerData);

  try {
    const response = await axiosInstance.post(`/user/register`, registerData);
    console.log("registered: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error registering:", error);
    throw error;
  }
};

export default register; 