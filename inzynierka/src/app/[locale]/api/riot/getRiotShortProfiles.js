const getRiotShortProfiles = async (axiosInstance, duos) => {
  const data = duos.content.map((duo) => duo.puuid);

  try {
    console.log("data samych puuid", data);
    const response = await axiosInstance.post("/riot/getRiotProfiles", {
      riotProfiles: data,
    });
    console.log("short profiles", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching short profiles");
  }
};

export default getRiotShortProfiles;
