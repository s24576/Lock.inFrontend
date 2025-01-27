const changeLocale = async (axiosInstance, locale) => {
  try {
    const response = await axiosInstance.put(
      `/user/changeLocale`,
      {},
      {
        headers: {
          "Accept-Language": locale,
        },
      }
    );
    console.log("locale changed: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error changing locale:", error);
  }
};
export default changeLocale;
