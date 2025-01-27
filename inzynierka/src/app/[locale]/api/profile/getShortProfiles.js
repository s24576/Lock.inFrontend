const getShortProfiles = async (axiosInstance, usernames) => {
  try {
    const response = await axiosInstance.post(`/profile/getShortProfiles`, {
      usernames: usernames,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching short lockin profiles:", error);
  }
};

export default getShortProfiles;
