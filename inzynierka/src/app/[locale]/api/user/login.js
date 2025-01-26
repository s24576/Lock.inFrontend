const login = async (axiosInstance, password, username) => {
  console.log("logging in: ");

  const formData = {
    username,
    password,
  };

  console.log(formData);

  try {
    const response = await axiosInstance.post(`/user/login`, formData);
    console.log("logged In: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error logging in:", error);
    throw error;
  }
};
export default login;
