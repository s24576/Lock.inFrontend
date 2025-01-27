const claimAccount = async (axiosIstance, server, puuid) => {
  const server_puuid = `${server}_${puuid}`;

  try {
    const response = await axiosIstance.put(
      `/profile/manageMyAccount?server_puuid=${server_puuid}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default claimAccount;
