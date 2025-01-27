const changePassword = async (
  axiosInstance,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  const formData = {
    oldPassword,
    newPassword,
    confirmPassword,
  };

  try {
    const response = await axiosInstance.put("/user/changePassword", formData);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default changePassword;
