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
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getRiotShortProfileById;
