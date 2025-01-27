const saveBuild = async (axiosIstance, buildId) => {
  try {
    const response = await axiosIstance.put(
      `/build/saveBuild?buildId=${buildId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default saveBuild;
