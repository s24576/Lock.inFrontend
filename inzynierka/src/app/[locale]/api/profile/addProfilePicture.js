const addProfilePicture = async (axiosInstance, picture) => {
  console.log("siema", picture);

  try {
    const response = await axiosInstance.post(
      `/profile/addProfilePicture/`,
      picture
    );
    console.log("picture added: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error adding film:", error);
  }
};

export default addProfilePicture;
