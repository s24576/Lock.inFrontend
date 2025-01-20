const claimAccount = async (axiosIstance, server, puuid) => {
  const server_puuid = `${server}_${puuid}`;

  try {
    const response = await axiosIstance.put(
      `/profile/manageMyAccount?server_puuid=${server_puuid}`
    );
    console.log("claimed/unclaimed profile");
  } catch (error) {
    console.error(error);
    throw new Error("Error claimed/unclaimed profile");
  }
};

export default claimAccount;
