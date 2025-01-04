import axios from "axios";

const findProfile = async (axiosInstance, username) => {
  try {
    const response = await axiosInstance.get(
      `/profile/findProfile?username=${username}`
    );
    console.log("searched profile", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding profile");
  }
};

export default findProfile;
