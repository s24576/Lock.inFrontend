const login = async (axiosInstance, password, username) => {
  const formData = {
    username,
    password,
  };
  try {
    const response = await axiosInstance.post(`/user/login`, formData);
    return response.data;
  } catch (error) {
    console.log("Error logging in:", error);
  }
};
export default login;
