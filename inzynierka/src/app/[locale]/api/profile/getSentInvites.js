//invites from me

const getSentInvites = async (axiosInstance) => {
  const size = 10;
  const page = 0;

  try {
    const response = await axiosInstance.get(
      `/profile/from?size=${size}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching invites from me:", error);
  }
};

export default getSentInvites;
