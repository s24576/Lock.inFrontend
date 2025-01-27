const deleteBuild = async (axiosIstance, buildId) => {
  try {
    const response = await axiosIstance.delete(
      `/build/deleteBuild?buildId=${buildId}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default deleteBuild;
