const followProfile = async (axiosIstance, server, puuid) => {
  const server_puuid = `${server}_${puuid}`;

  try {
    const response = await axiosIstance.put(
      `/profile/manageWatchlist?server_puuid=${server_puuid}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default followProfile;
