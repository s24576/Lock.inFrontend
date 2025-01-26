const changePassword = async (
  axiosInstance,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  console.log("changing password: ");

  const formData = {
    oldPassword,
    newPassword,
    confirmPassword,
  };

  console.log(formData);

  try {
    const response = await axiosInstance.put("/user/changePassword", formData);
    console.log("password changed: ", response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export default changePassword;
