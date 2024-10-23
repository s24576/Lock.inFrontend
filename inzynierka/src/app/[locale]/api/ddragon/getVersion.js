import axios from "axios";

const getVersion = async (language) => {
  let version = "";

  try {
    const response = await axios.get(
      `http://localhost:8080/ddragon/getVersion`,
      {
        headers: {
          "Accept-Language": language,
        },
      }
    );
    version = response.data;
  } catch (error) {
    console.log(error);
  }

  return version;
};

export default getVersion;
