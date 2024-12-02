import axios from "axios";

const addProfilePicture = async (axiosInstance, formData) => {
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
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
    throw error;
  }
};

export default addProfilePicture;
