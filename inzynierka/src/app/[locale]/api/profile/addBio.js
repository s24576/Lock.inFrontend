const addBio = async (axiosInstance, bio) => {
  console.log("bio data: ", bio);

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
    console.log("bio created: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error adding bio:", error);
    throw new Error("Error adding bio:"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default addBio;
