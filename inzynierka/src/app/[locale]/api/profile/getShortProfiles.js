const getShortProfiles = async (axiosInstance, usernames) => {
  try {
    const response = await axiosInstance.post(`/profile/getShortProfiles`, {
      usernames: usernames,
    });
    console.log("short lockin profiles: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching short lockin profiles:", error);
    throw new Error("Error fetching short lockin profiles");
  }
};

export default getShortProfiles;
