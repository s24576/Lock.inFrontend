const getLocale = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/user/getLocale`);
    console.log("locale : ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching locale:", error);
    throw new Error("Error fetching locale");
  }
};

export default getLocale;
