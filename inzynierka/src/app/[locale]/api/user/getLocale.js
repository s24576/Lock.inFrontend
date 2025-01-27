const getLocale = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/user/getLocale`);
    return response.data;
  } catch (error) {
    console.log("Error fetching locale:", error);
  }
};

export default getLocale;
