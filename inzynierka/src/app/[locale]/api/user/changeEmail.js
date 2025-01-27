const changeEmail = async (axiosInstance, password, email) => {
  const formData = {
    password,
    email,
  };
  try {
    const response = await axiosInstance.put("/user/changeEmail", {
      password,
      email,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default changeEmail;
