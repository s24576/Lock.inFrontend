const followProfile = async (axiosIstance, server, puuid) => {
  const server_puuid = `${server}_${puuid}`;

  try {
    const response = await axiosIstance.put(
      `/profile/manageWatchlist?server_puuid=${server_puuid}`
    );
    console.log("followed/unfollowed profile");
  } catch (error) {
    console.error(error);
    throw new Error("Error following/unfollowing profile");
  }
};

export default followProfile;
