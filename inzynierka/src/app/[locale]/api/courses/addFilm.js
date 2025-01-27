const addFilm = async (axiosInstance, filmData, courseId) => {
  console.log("film data: ", filmData);

  try {
    const response = await axiosInstance.post(
      `/api/course/addFilm?courseId=${courseId}`,
      filmData
    );
    console.log("film created: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error adding film:", error);
    throw new Error("Error adding film:");
  }
};

export default addFilm;
