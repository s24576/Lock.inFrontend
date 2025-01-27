//invites to me

const getYourInvites = async (axiosInstance) => {
  const size = 10;
  const page = 0;

  try {
    const response = await axiosInstance.get(
      `/profile/to?size=${size}&page=${page}`
    );
    console.log("invites to me : ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching invites to me:", error);
    throw new Error("Error fetching invites to me");
  }
};

export default getYourInvites;
