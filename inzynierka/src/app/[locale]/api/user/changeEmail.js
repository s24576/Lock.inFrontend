const changeEmail = async (axiosInstance, password, email) => {
  console.log("changing password: ");

  const formData = {
    password,
    email,
  };

  console.log(formData);

  try {
    const response = await axiosInstance.put(`/user/changeEmail`, formData);
    console.log("email changed: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error changing email:", error);
  }
};
export default changeEmail;
