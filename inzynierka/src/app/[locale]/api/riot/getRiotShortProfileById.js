import axios from "axios";

const getRiotShortProfileById = async (language, server_puuid) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/riot/getRiotProfileByPuuid?server_puuid=${server_puuid}`,
      {
        headers: {
          "Accept-Language": language,
        },
      }
    );
    console.log("short riot profile by id:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching duos");
  }
};

export default getRiotShortProfileById;
