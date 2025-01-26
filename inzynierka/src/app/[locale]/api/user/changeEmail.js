const changeEmail = async (axiosInstance, password, email) => {
  console.log("changing password: ");

  const formData = {
    password,
    email,
  };

  console.log(formData);

  try {
    const response = await axiosInstance.put("/user/changeEmail", {
      password,
      email,
    });
    console.log("email changed: ", response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export default changeEmail;
