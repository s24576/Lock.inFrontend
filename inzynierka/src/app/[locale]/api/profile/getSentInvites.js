//invites from me

const getSentInvites = async (axiosInstance) => {
  const size = 10;
  const page = 0;

  try {
    const response = await axiosInstance.get(
      `/profile/from?size=${size}&page=${page}`
    );
    console.log("invites from me : ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching invites from me:", error);
    throw new Error("Error fetching invites from me");
  }
};

export default getSentInvites;
