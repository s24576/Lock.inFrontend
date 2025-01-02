const getOwnedCourses = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get("/api/course/getOwnedCourses");
    console.log("owned courses", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching courses");
  }
};

export default getOwnedCourses;
