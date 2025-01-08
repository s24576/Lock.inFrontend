const saveBuild = async (axiosIstance, buildId) => {
  console.log("build id : ", buildId);
  try {
    const response = await axiosIstance.put(
      `/build/saveBuild?buildId=${buildId}`
    );
    console.log("saved/unsaved build");
  } catch (error) {
    console.error(error);
    throw new Error("Error saving build");
  }
};

export default saveBuild;
