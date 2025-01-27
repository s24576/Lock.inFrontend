const addProfilePicture = async (axiosInstance, formData) => {
  try {
    const response = await axiosInstance.post(
      "/profile/addProfilePicture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
  }
};

export default addProfilePicture;
