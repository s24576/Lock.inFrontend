import axios from "axios";

const getRiotShortProfiles = async (duos, language) => {
  const data = duos.content.map((duo) => duo.puuid);

  try {
    console.log("data samych puuid", data);
    const response = await axios.post(
      "http://localhost:8080/riot/getRiotProfiles",
      {
        riotProfiles: data, // Przekaż tablicę puuids jako element body
      },
      {
        headers: {
          "Accept-Language": language,
        },
      }
    );
    console.log("short profiles", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching short profiles");
  }
};

export default getRiotShortProfiles;
