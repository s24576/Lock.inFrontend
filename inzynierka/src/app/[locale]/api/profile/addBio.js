const addBio = async (axiosInstance, bio) => {
  try {
    const response = await axiosInstance.post(
      `/profile/addBio`,
      { bio },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error adding bio:", error);
  }
};

export default addBio;
