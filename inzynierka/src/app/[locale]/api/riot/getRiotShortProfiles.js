const getRiotShortProfiles = async (axiosInstance, duos) => {
  const data = duos.content.map((duo) => duo.puuid);

  try {
    const response = await axiosInstance.post("/riot/getRiotProfiles", {
      riotProfiles: data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getRiotShortProfiles;
