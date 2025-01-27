const findProfile = async (axiosInstance, username) => {
  try {
    const response = await axiosInstance.get(
      `/profile/findProfile?username=${username}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default findProfile;
