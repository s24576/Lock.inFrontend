const deleteBuild = async (axiosIstance, buildId) => {
  console.log("build id : ", buildId);
  try {
    const response = await axiosIstance.delete(
      `/build/deleteBuild?buildId=${buildId}`
    );
    console.log("deleted build");
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting build");
  }
};

export default deleteBuild;
