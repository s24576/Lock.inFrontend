const deleteBuild = async (axiosIstance, buildId) => {
  console.log("build id : ", buildId);
  try {
    const response = await axiosIstance.delete(
      `/build/deleteBuild?buildId=${buildId}`
    );
    console.log("deleted comment");
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting comment");
  }
};

export default deleteBuild;
