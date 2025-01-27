const addFilm = async (axiosInstance, filmData, courseId) => {
  try {
    const response = await axiosInstance.post(
      `/api/course/addFilm?courseId=${courseId}`,
      filmData
    );
    return response.data;
  } catch (error) {
    console.log("Error adding film:", error);
  }
};

export default addFilm;
