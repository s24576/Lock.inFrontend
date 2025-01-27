const getCoursePreviewById = async (axiosInstance, courseId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/getCoursePreviewById?courseId=${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getCoursePreviewById;
